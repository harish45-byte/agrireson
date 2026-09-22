package com.farmmarket.dto;

import com.farmmarket.entity.Crop;
import java.time.LocalDate;

public class CropResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String cropName;
    private Double area;
    private LocalDate plantingDate;
    private LocalDate harvestDate;
    private String status;

    public CropResponse() {
    }

    public CropResponse(Crop crop) {
        if (crop != null) {
            this.id = crop.getId();
            if (crop.getFarmer() != null) {
                this.farmerId = crop.getFarmer().getId();
                this.farmerName = crop.getFarmer().getName();
            }
            this.cropName = crop.getCropName();
            this.area = crop.getArea();
            this.plantingDate = crop.getPlantingDate();
            this.harvestDate = crop.getHarvestDate();
            this.status = crop.getStatus();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public LocalDate getPlantingDate() {
        return plantingDate;
    }

    public void setPlantingDate(LocalDate plantingDate) {
        this.plantingDate = plantingDate;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
