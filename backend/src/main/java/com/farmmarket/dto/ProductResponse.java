package com.farmmarket.dto;

import com.farmmarket.entity.Product;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String farmerPhone;
    private Long categoryId;
    private String categoryName;
    private Long cropId;
    private String cropName;
    private String name;
    private String description;
    private Double price;
    private Double quantity;
    private String unit;
    private LocalDate harvestDate;
    private String imageUrl;
    private Boolean active;
    private LocalDateTime createdAt;

    public ProductResponse() {
    }

    public ProductResponse(Product product) {
        if (product != null) {
            this.id = product.getId();
            if (product.getFarmer() != null) {
                this.farmerId = product.getFarmer().getId();
                this.farmerName = product.getFarmer().getName();
                this.farmerPhone = product.getFarmer().getPhone();
            }
            if (product.getCategory() != null) {
                this.categoryId = product.getCategory().getId();
                this.categoryName = product.getCategory().getName();
            }
            if (product.getCrop() != null) {
                this.cropId = product.getCrop().getId();
                this.cropName = product.getCrop().getCropName();
            }
            this.name = product.getName();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.quantity = product.getQuantity();
            this.unit = product.getUnit();
            this.harvestDate = product.getHarvestDate();
            this.imageUrl = product.getImageUrl();
            this.active = product.getActive();
            this.createdAt = product.getCreatedAt();
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

    public String getFarmerPhone() {
        return farmerPhone;
    }

    public void setFarmerPhone(String farmerPhone) {
        this.farmerPhone = farmerPhone;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
