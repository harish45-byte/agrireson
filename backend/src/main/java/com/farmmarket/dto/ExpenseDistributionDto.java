package com.farmmarket.dto;

import com.farmmarket.entity.ExpenseType;

public class ExpenseDistributionDto {
    private ExpenseType expenseType;
    private Double amount;
    private Double percentage;

    public ExpenseDistributionDto() {
    }

    public ExpenseDistributionDto(ExpenseType expenseType, Double amount, Double percentage) {
        this.expenseType = expenseType;
        this.amount = amount;
        this.percentage = percentage;
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

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
