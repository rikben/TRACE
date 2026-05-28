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

#Normalize the point cloud 
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
# TREE CENTROIDS
#################################################

# centroid of each segmented crown polygon
tree_centroids <- sf::st_centroid(tree_stats)

# extract centroid coordinates
coords <- sf::st_coordinates(tree_centroids)

tree_stats$centroid_x <- coords[,1]
tree_stats$centroid_y <- coords[,2]

#################################################
# CROWN COMPLEXITY SCORE
#################################################

# normalize variables between 0 and 1
norm_height <- (
  tree_stats$height_max -
    min(tree_stats$height_max, na.rm = TRUE)
) / (
  max(tree_stats$height_max, na.rm = TRUE) -
    min(tree_stats$height_max, na.rm = TRUE)
)

norm_volume <- (
  tree_stats$crown_volume -
    min(tree_stats$crown_volume, na.rm = TRUE)
) / (
  max(tree_stats$crown_volume, na.rm = TRUE) -
    min(tree_stats$crown_volume, na.rm = TRUE)
)

norm_diameter <- (
  tree_stats$crown_diameter -
    min(tree_stats$crown_diameter, na.rm = TRUE)
) / (
  max(tree_stats$crown_diameter, na.rm = TRUE) -
    min(tree_stats$crown_diameter, na.rm = TRUE)
)

#################################################
# COMBINED COMPLEXITY SCORE
#################################################

# weighted complexity score
tree_stats$crown_complexity <- (
  0.5 * norm_volume +
    0.3 * norm_height +
    0.2 * norm_diameter
)

tree_stats$crown_complexity_score <-
  round(tree_stats$crown_complexity * 100, 1)

#################################################
# VIEW RESULTS
#################################################

head(tree_stats)

summary(tree_stats$crown_complexity_score)




#################################################
# HEATMAP OF CROWN COMPLEXITY
#################################################

# convert crowns to terra vector
tree_vect <- vect(tree_stats)

#################################################
# REPROJECT ONLY FOR HEATMAP EXPORT
#################################################

# reproject vectors to Web Mercator
tree_vect_3857 <- project(tree_vect, "EPSG:3857")

# reproject CHM extent/template
chm_3857 <- project(chm, "EPSG:3857")

#################################################
# CREATE RASTER TEMPLATE
#################################################

heatmap_raster <- rast(
  ext(chm_3857),
  resolution = 1,   # 1 meter
  crs = "EPSG:3857"
)

#################################################
# RASTERIZE POLYGONS
#################################################

heatmap <- rasterize(
  tree_vect_3857,
  heatmap_raster,
  field = "crown_complexity_score",
  fun = mean,
  background = NA,
  touches = TRUE
)

#################################################
# SMOOTH ONLY VALID PIXELS
#################################################

heatmap <- focal(
  heatmap,
  w = matrix(1,7,7),
  fun = mean,
  na.rm = TRUE
)

#################################################
# GREEN COLOR PALETTE
#################################################

green_palette <- colorRampPalette(c(
  "#d9f0d3",
  "#78c679",
  "#238443",
  "#004529"
))

#################################################
# CREATE PLOT VERSION
#################################################

# keep plotting clean by hiding nodata
plot_heatmap <- heatmap

#################################################
# PLOT
#################################################

plot(
  plot_heatmap,
  col = green_palette(100),
  main = "Tree Crown Complexity Heatmap"
)

#################################################
# EXPORT VERSION WITH NODATA = -9999
#################################################

# create export copy
heatmap_export <- heatmap

# assign nodata only for export
heatmap_export[is.na(heatmap_export)] <- -9999

#################################################
# EXPORT CLOUD OPTIMIZED GEOTIFF
#################################################

writeRaster(
  heatmap_export,
  "tree_crown_complexity_heatmap_cog_3857.tif",
  overwrite = TRUE,
  
  filetype = "COG",
  
  NAflag = -9999,
  
  gdal = c(
    "COMPRESS=DEFLATE",
    "LEVEL=9",
    "PREDICTOR=2",
    "OVERVIEWS=AUTO",
    "BLOCKSIZE=512"
  )
)



#################################################
# EXPORT
#################################################

write.csv(
  sf::st_drop_geometry(tree_stats),
  "tree_statistics.csv",
  row.names = FALSE
)




