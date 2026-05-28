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
- Embedded 3D point cloud viewer
- Designed primarily for **deciduous forest environments**

### Technologies

- PHP
- JavaScript
- Bootstrap 5
- OpenLayers
- Potree
- MySQL
- Docker Compose

---

## `AHN6-Reirinck/`

R-based workflow for analysing LiDAR data and deriving forest structure metrics from AHN data.

### Current analyses include

- Tree segmentation
- Crown and tree statistics
- Forest structure metrics
- LiDAR preprocessing workflows
- Calculate normalized weighted crown complexity score
- Create heatmap based on complexity score

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

---

# Running the Dashboard

The `forest-dashboard` directory contains the main project deliverable: an interactive biodiversity dashboard.

## Requirements

Before starting, make sure the following software is installed:

- Docker Desktop  
  https://www.docker.com/products/docker-desktop/

- Git  
  https://git-scm.com/

---

## 1. Clone or Download the Repository

Clone the repository using Git:

```bash
git clone https://github.com/rikben/TRACE.git
```

Or download the repository as a ZIP file from GitHub and extract it locally.

---

## 2. Navigate to the Dashboard Directory

```bash
cd TRACE/forest-dashboard
```

---

## 3. Configure Environment Variables

Inside the `forest-dashboard` folder, copy the example environment file:

```bash
cp .env.example .env
```

Open the `.env` file and configure secure credentials and settings.

Example:

```env
DB_NAME=forest_dashboard
DB_USER=forest_user
DB_PASSWORD=your_secure_password
DB_ROOT_PASS=your_secure_root_password
```

It is recommended to use strong passwords when deploying the dashboard outside local development.

---

## 4. Start Docker Desktop

Before running Docker Compose, ensure Docker Desktop is running.

You can verify Docker is active with:

```bash
docker info
```

---

## 5. Start the Application

Run Docker Compose:

```bash
docker compose up
```

The first startup may take a few minutes while Docker downloads the required images.

---

## 6. Open the Dashboard

After startup, the dashboard will be available at:

- Dashboard:  
  http://localhost:8080

- phpMyAdmin:  
  http://localhost:8081

---

## 7. Stop the Application

To stop the containers:

```bash
docker compose down
```

---

# Running the R Workflows

The `AHN6-Reirinck` directory contains R scripts used for LiDAR processing and biodiversity analysis.

## Requirements

Install:

- R  
  https://cran.r-project.org/

- RStudio (recommended)  
  https://posit.co/download/rstudio-desktop/

Required R packages depend on the individual scripts and workflows.

Download:

- https://www.ahn.nl/dataroom 

As there is no data in this repository the AHN data needs to be download from the website above.
---

## Running the Scripts

Navigate to the R workflow directory:

```bash
cd TRACE/AHN6-Reirinck
```

Open the desired R project or script in RStudio and execute the workflow manually.

Example:

```r
source("analysis_script.R")
```

The workflows are designed for experimentation and analysis rather than automated deployment.

---

# Notes

- The dashboard is optimised for mobile field usage.
- Biodiversity interpretation and questionnaire logic are primarily designed for deciduous forest environments.
- Large point cloud assets are managed using Git LFS.

---

# Authors

TRACE was developed as part of the Remote Sensing and GIS Integration course at Wageningen University & Research.