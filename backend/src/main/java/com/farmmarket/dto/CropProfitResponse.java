package com.farmmarket.dto;

public class CropProfitResponse {
    private Long cropId;
    private String cropName;
    private Double area;
    private Double revenue;
    private Double expenses;
    private Double profit;
    private Double profitMargin;

    public CropProfitResponse() {
    }

    public CropProfitResponse(Long cropId, String cropName, Double area, Double revenue, Double expenses, Double profit, Double profitMargin) {
        this.cropId = cropId;
        this.cropName = cropName;
        this.area = area;
        this.revenue = revenue;
        this.expenses = expenses;
        this.profit = profit;
        this.profitMargin = profitMargin;
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

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Double getExpenses() {
        return expenses;
    }

    public void setExpenses(Double expenses) {
        this.expenses = expenses;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public Double getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(Double profitMargin) {
        this.profitMargin = profitMargin;
    }
}
