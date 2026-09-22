package com.farmmarket.dto;

import java.util.ArrayList;
import java.util.List;

public class ProfitSummaryResponse {
    private Double revenue = 0.0;
    private Double expenses = 0.0;
    private Double profit = 0.0;
    private Double profitMargin = 0.0;
    private Double productsSold = 0.0;
    private Long activeProducts = 0L;
    private Long pendingOrders = 0L;
    private Long totalOrders = 0L;
    private List<ExpenseDistributionDto> expenseBreakdown = new ArrayList<>();
    private List<CropProfitResponse> cropProfits = new ArrayList<>();

    public ProfitSummaryResponse() {
    }

    public ProfitSummaryResponse(Double revenue, Double expenses, Double profit, Double profitMargin, Double productsSold, Long activeProducts, Long pendingOrders, Long totalOrders) {
        this.revenue = revenue != null ? revenue : 0.0;
        this.expenses = expenses != null ? expenses : 0.0;
        this.profit = profit != null ? profit : 0.0;
        this.profitMargin = profitMargin != null ? profitMargin : 0.0;
        this.productsSold = productsSold != null ? productsSold : 0.0;
        this.activeProducts = activeProducts != null ? activeProducts : 0L;
        this.pendingOrders = pendingOrders != null ? pendingOrders : 0L;
        this.totalOrders = totalOrders != null ? totalOrders : 0L;
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

    public Double getProductsSold() {
        return productsSold;
    }

    public void setProductsSold(Double productsSold) {
        this.productsSold = productsSold;
    }

    public Long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(Long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public List<ExpenseDistributionDto> getExpenseBreakdown() {
        return expenseBreakdown;
    }

    public void setExpenseBreakdown(List<ExpenseDistributionDto> expenseBreakdown) {
        this.expenseBreakdown = expenseBreakdown;
    }

    public List<CropProfitResponse> getCropProfits() {
        return cropProfits;
    }

    public void setCropProfits(List<CropProfitResponse> cropProfits) {
        this.cropProfits = cropProfits;
    }
}
