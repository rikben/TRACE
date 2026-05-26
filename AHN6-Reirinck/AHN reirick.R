# required packages
required_packages <- c('lidR','terra','colorRamps','rgl','sf')

# install missing packages
missing_packages <- required_packages[!(required_packages %in% installed.packages()[,"Package"])]

if (length(missing_packages) > 0) {
  install.packages(missing_packages)
}

# load libraries
invisible(lapply(required_packages, function(pkg) {
  suppressMessages(library(pkg, character.only = TRUE))
}))

las_file <- "part2/AHN6_2025_C_241000_450000.LAZ"   #Ensure file is in working directory
ahn <- readLAS(las_file)

# set CRS explicitly
projection(ahn) <- "EPSG:28992"

# read GeoJSON bounding box / polygon
bb <- st_read("part2/Reirinck_bb.geojson")

# merge all polygons into one
bb_union <- st_union(bb)

# clip
ahn_small <- clip_roi(ahn, bb_union)

# visualize
plot(ahn_small)





################simple plots#####################
# first we classify the ground
ahn_ground <- classify_ground(ahn_small, csf())  # Cloth Simulation Filter

dtm <- rasterize_terrain(ahn_ground, res = 0.5, algorithm = tin())
dsm <- rasterize_canopy(ahn_small, res = 0.5, algorithm = p2r())

#plotting side by side
par(mfrow=c(1,2))
plot(dtm, main = "Digital Terrain Model (DTM)")
plot(dsm, main = "Digital Surface Model (DSM)")

chm <- dsm - dtm
plot(chm, main = "Canopy Height Model (CHM)")

##########individual trees dectection################
treetops <- locate_trees(ahn_small, lmf(ws = 6, hmin= 5))

plot(chm)
plot(treetops$geometry, add = TRUE, col = "blue", cex = 0.5, pch = 3)

x <- plot(ahn_small, bg = "white", size = 4)
add_treetops3d(x, treetops)

############individual trees segmentation#############
# replace `yourCRvalue` with a value:
# segmenting trees using silva2016 algorithm
trees_silva2016 <- segment_trees(ahn_small, silva2016(chm, treetops, max_cr_factor= 0.7, ID="treeID"), attribute = "treeID")
# plotting
plot(trees_silva2016, color = "treeID")
# summary of the number of trees found.
summary(trees_silva2016@data[["treeID"]])

visualizedtreeID <- filter_poi(trees_silva2016, treeID == 111)
plot(visualizedtreeID, size = 6, bg = "white")

#################################################
# TREE-LEVEL STATISTICS
#################################################

# 1. Normalize the point cloud using the DTM generated earlier
# This ensures Z coordinates represent height above ground, not elevation
trees_normalized <- normalize_height(trees_silva2016, dtm)

# remove unsegmented points
trees <- filter_poi(trees_normalized, !is.na(treeID))

# compute metrics
tree_stats <- crown_metrics(
  trees,
  func = ~list(
    
    # heights
    height_max  = max(Z),
    
    # point count
    n_points = length(Z),
    
    # crown dimensions
    crown_radius = max(dist(cbind(X, Y))) / 2,
    crown_diameter = max(dist(cbind(X, Y))),
    
    # approximate crown volume
    crown_volume = pi *
      (max(dist(cbind(X, Y))) / 2)^2 *
      max(Z) * 0.5
  ),
  geom = "convex"
)

#################################################
# VIEW RESULTS
#################################################

print(tree_stats)

summary(tree_stats)

#################################################
# EXPORT
#################################################

write.csv(
  sf::st_drop_geometry(tree_stats),
  "tree_statistics.csv",
  row.names = FALSE
)


