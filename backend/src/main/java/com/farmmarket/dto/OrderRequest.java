package com.farmmarket.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class OrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    private String shippingAddress;
    private String contactPhone;
    private String paymentMethod = "Cash on Delivery";

    public OrderRequest() {
    }

    public OrderRequest(List<OrderItemRequest> items, String shippingAddress, String contactPhone, String paymentMethod) {
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.contactPhone = contactPhone;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "Cash on Delivery";
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
