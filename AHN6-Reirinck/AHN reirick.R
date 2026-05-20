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

# optional: save clipped file
writeLAS(ahn_small, "part2/AHN6_clipped.laz")



################simple plots#####################
# first we classify the ground
ahn_ground <- classify_ground(ahn_small, csf())  # Cloth Simulation Filter
 
dtm <- rasterize_terrain(ahn_ground, res = 1, algorithm = tin())
dsm <- rasterize_canopy(ahn_small, res = 1, algorithm = p2r())

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
#trees_silva2016 <- segment_trees(ahn_small, silva2016values, attribute = "treeID")
# plotting
plot(trees_silva2016, color = "treeID")
# summary of the number of trees found.
summary(trees_silva2016@data[["treeID"]])


# segmenting trees using dalponte2016 algorithm
trees_dalponte2016 <- segment_trees(ahn_small, dalponte2016(chm, treetops), attribute = "treeID")
# plotting
plot(trees_dalponte2016, color = "treeID")
# summary of the number of trees found.
summary(trees_dalponte2016@data[["treeID"]])

visualizedtreeID <- filter_poi(trees_dalponte2016, treeID == 111)
plot(visualizedtreeID, size = 6, bg = "white")

