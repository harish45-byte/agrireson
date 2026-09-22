package com.farmmarket.dto;

import com.farmmarket.entity.Crop;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class CropRequest {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private Double area;

    private LocalDate plantingDate;
    private LocalDate harvestDate;
    private String status = "ACTIVE";

    public CropRequest() {
    }

    public CropRequest(String cropName, Double area, LocalDate plantingDate, LocalDate harvestDate, String status) {
        this.cropName = cropName;
        this.area = area;
        this.plantingDate = plantingDate;
        this.harvestDate = harvestDate;
        this.status = status != null ? status : "ACTIVE";
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
