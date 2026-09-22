package com.farmmarket.dto;

import com.farmmarket.entity.Expense;
import com.farmmarket.entity.ExpenseType;
import java.time.LocalDate;

public class ExpenseResponse {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private Long cropId;
    private String cropName;
    private ExpenseType expenseType;
    private Double amount;
    private String description;
    private LocalDate expenseDate;

    public ExpenseResponse() {
    }

    public ExpenseResponse(Expense expense) {
        if (expense != null) {
            this.id = expense.getId();
            if (expense.getFarmer() != null) {
                this.farmerId = expense.getFarmer().getId();
                this.farmerName = expense.getFarmer().getName();
            }
            if (expense.getCrop() != null) {
                this.cropId = expense.getCrop().getId();
                this.cropName = expense.getCrop().getCropName();
            }
            this.expenseType = expense.getExpenseType();
            this.amount = expense.getAmount();
            this.description = expense.getDescription();
            this.expenseDate = expense.getExpenseDate();
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

    public ExpenseType getExpenseType() {
        return expenseType;
    }

    public void setExpenseType(ExpenseType expenseType) {
        this.expenseType = expenseType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }
}
