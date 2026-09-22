package com.farmmarket.dto;

public class AdminStatsResponse {
    private Long totalFarmers;
    private Long totalBuyers;
    private Long totalProducts;
    private Long totalOrders;
    private Double totalMarketplaceRevenue;
    private Long pendingOrders;
    private Long deliveredOrders;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(Long totalFarmers, Long totalBuyers, Long totalProducts, Long totalOrders, Double totalMarketplaceRevenue, Long pendingOrders, Long deliveredOrders) {
        this.totalFarmers = totalFarmers;
        this.totalBuyers = totalBuyers;
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalMarketplaceRevenue = totalMarketplaceRevenue;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
    }

    public Long getTotalFarmers() {
        return totalFarmers;
    }

    public void setTotalFarmers(Long totalFarmers) {
        this.totalFarmers = totalFarmers;
    }

    public Long getTotalBuyers() {
        return totalBuyers;
    }

    public void setTotalBuyers(Long totalBuyers) {
        this.totalBuyers = totalBuyers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Double getTotalMarketplaceRevenue() {
        return totalMarketplaceRevenue;
    }

    public void setTotalMarketplaceRevenue(Double totalMarketplaceRevenue) {
        this.totalMarketplaceRevenue = totalMarketplaceRevenue;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }
}
