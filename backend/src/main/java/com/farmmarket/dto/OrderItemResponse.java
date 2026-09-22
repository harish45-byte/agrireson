package com.farmmarket.dto;

import com.farmmarket.entity.OrderItem;

public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productUnit;
    private String productImage;
    private Long farmerId;
    private String farmerName;
    private Double quantity;
    private Double price;
    private Double subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(OrderItem item) {
        if (item != null) {
            this.id = item.getId();
            if (item.getProduct() != null) {
                this.productId = item.getProduct().getId();
                this.productName = item.getProduct().getName();
                this.productUnit = item.getProduct().getUnit();
                this.productImage = item.getProduct().getImageUrl();
            }
            if (item.getFarmer() != null) {
                this.farmerId = item.getFarmer().getId();
                this.farmerName = item.getFarmer().getName();
            }
            this.quantity = item.getQuantity();
            this.price = item.getPrice();
            this.subtotal = item.getSubtotal();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductUnit() {
        return productUnit;
    }

    public void setProductUnit(String productUnit) {
        this.productUnit = productUnit;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
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

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
