package com.bookstore.dto;

import com.bookstore.entity.OrderStatus;
import com.bookstore.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private UserDto user;
    private List<OrderItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal shippingCharge;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZip;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime deliveredAt;

    public OrderDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderDto d = new OrderDto();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder orderNumber(String v) { d.orderNumber = v; return this; }
        public Builder user(UserDto v) { d.user = v; return this; }
        public Builder items(List<OrderItemDto> v) { d.items = v; return this; }
        public Builder subtotal(BigDecimal v) { d.subtotal = v; return this; }
        public Builder discount(BigDecimal v) { d.discount = v; return this; }
        public Builder tax(BigDecimal v) { d.tax = v; return this; }
        public Builder shippingCharge(BigDecimal v) { d.shippingCharge = v; return this; }
        public Builder totalAmount(BigDecimal v) { d.totalAmount = v; return this; }
        public Builder status(OrderStatus v) { d.status = v; return this; }
        public Builder paymentStatus(PaymentStatus v) { d.paymentStatus = v; return this; }
        public Builder paymentMethod(String v) { d.paymentMethod = v; return this; }
        public Builder shippingAddress(String v) { d.shippingAddress = v; return this; }
        public Builder shippingCity(String v) { d.shippingCity = v; return this; }
        public Builder shippingState(String v) { d.shippingState = v; return this; }
        public Builder shippingZip(String v) { d.shippingZip = v; return this; }
        public Builder notes(String v) { d.notes = v; return this; }
        public Builder createdAt(LocalDateTime v) { d.createdAt = v; return this; }
        public Builder deliveredAt(LocalDateTime v) { d.deliveredAt = v; return this; }
        public OrderDto build() { return d; }
    }

    public Long getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public UserDto getUser() { return user; }
    public List<OrderItemDto> getItems() { return items; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getDiscount() { return discount; }
    public BigDecimal getTax() { return tax; }
    public BigDecimal getShippingCharge() { return shippingCharge; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getShippingAddress() { return shippingAddress; }
    public String getShippingCity() { return shippingCity; }
    public String getShippingState() { return shippingState; }
    public String getShippingZip() { return shippingZip; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }

    public static class OrderItemDto {
        private Long id;
        private BookDto book;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public OrderItemDto() {}
        public static ItemBuilder builder() { return new ItemBuilder(); }
        public static class ItemBuilder {
            private final OrderItemDto d = new OrderItemDto();
            public ItemBuilder id(Long v) { d.id = v; return this; }
            public ItemBuilder book(BookDto v) { d.book = v; return this; }
            public ItemBuilder quantity(Integer v) { d.quantity = v; return this; }
            public ItemBuilder unitPrice(BigDecimal v) { d.unitPrice = v; return this; }
            public ItemBuilder totalPrice(BigDecimal v) { d.totalPrice = v; return this; }
            public OrderItemDto build() { return d; }
        }
        public Long getId() { return id; }
        public BookDto getBook() { return book; }
        public Integer getQuantity() { return quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public BigDecimal getTotalPrice() { return totalPrice; }
    }
}
