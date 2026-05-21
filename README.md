# TRACE

**Tree Remote Sensing and Complexity Evaluation (TRACE)**  
*Wageningen University & Research — Remote Sensing and GIS Integration (IDHV)*

TRACE is a project focused on evaluating forest biodiversity and structural complexity using a combination of:

- remote sensing,
- LiDAR-derived forest metrics,
- spatial analysis,
- and citizen science observations.

The repository combines analytical workflows in R with an interactive web dashboard used for biodiversity validation in the field.

---

# Repository Structure

## `forest-dashboard/`

Interactive web application for collecting and visualising citizen science observations.

### Features

- Interactive OpenLayers-based map
- Biodiversity validation questionnaire
- Mobile-friendly field data collection
- Photo uploads with automatic compression
- Observation scoring and visualisation
- Observation detail modal
- Layer controls and map legend
- Designed primarily for **deciduous forest environments**

### Technologies

- PHP
- JavaScript
- Bootstrap 5
- OpenLayers
- MySQL

---

## `AHN6-Reirinck/`

R-based workflow for analysing LiDAR data and deriving forest structure metrics from AHN data.

### Current analyses include

- Tree crown detection
- Crown statistics
- Forest structure metrics
- LiDAR preprocessing workflows

### Technologies

- R
- Spatial analysis libraries
- AHN6 LiDAR datasets

---

# Project Goals

The TRACE project investigates how remotely sensed forest structure relates to ecological complexity and biodiversity indicators.

The project aims to:

- derive forest metrics from LiDAR data,
- visualise biodiversity predictions spatially,
- validate predictions using citizen science observations,
- and explore how forest structure influences biodiversity.
