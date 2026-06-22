package com.bookstore.dto;

import java.util.List;

public class OrderRequest {
    private List<CartItemRequest> items;
    private String paymentMethod;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZip;
    private String notes;

    public OrderRequest() {}
    public List<CartItemRequest> getItems() { return items; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getShippingAddress() { return shippingAddress; }
    public String getShippingCity() { return shippingCity; }
    public String getShippingState() { return shippingState; }
    public String getShippingZip() { return shippingZip; }
    public String getNotes() { return notes; }
    public void setItems(List<CartItemRequest> v) { this.items = v; }
    public void setPaymentMethod(String v) { this.paymentMethod = v; }
    public void setShippingAddress(String v) { this.shippingAddress = v; }
    public void setShippingCity(String v) { this.shippingCity = v; }
    public void setShippingState(String v) { this.shippingState = v; }
    public void setShippingZip(String v) { this.shippingZip = v; }
    public void setNotes(String v) { this.notes = v; }

    public static class CartItemRequest {
        private Long bookId;
        private Integer quantity;
        public CartItemRequest() {}
        public Long getBookId() { return bookId; }
        public Integer getQuantity() { return quantity; }
        public void setBookId(Long v) { this.bookId = v; }
        public void setQuantity(Integer v) { this.quantity = v; }
    }
}
