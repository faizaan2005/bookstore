package com.bookstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "app_orders")
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal subtotal;
    @Column(precision = 10, scale = 2) private BigDecimal discount = BigDecimal.ZERO;
    @Column(precision = 10, scale = 2) private BigDecimal tax = BigDecimal.ZERO;
    @Column(precision = 10, scale = 2) private BigDecimal shippingCharge = BigDecimal.ZERO;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING) @Column(nullable = false) private OrderStatus status = OrderStatus.PENDING;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentMethod;
    private String transactionId;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZip;
    private String notes;
    private LocalDateTime deliveredAt;
    @Column(updatable = false) private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Order() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Order o = new Order();
        public Builder orderNumber(String v) { o.orderNumber = v; return this; }
        public Builder user(User v) { o.user = v; return this; }
        public Builder subtotal(BigDecimal v) { o.subtotal = v; return this; }
        public Builder discount(BigDecimal v) { o.discount = v; return this; }
        public Builder tax(BigDecimal v) { o.tax = v; return this; }
        public Builder shippingCharge(BigDecimal v) { o.shippingCharge = v; return this; }
        public Builder totalAmount(BigDecimal v) { o.totalAmount = v; return this; }
        public Builder status(OrderStatus v) { o.status = v; return this; }
        public Builder paymentStatus(PaymentStatus v) { o.paymentStatus = v; return this; }
        public Builder paymentMethod(String v) { o.paymentMethod = v; return this; }
        public Builder shippingAddress(String v) { o.shippingAddress = v; return this; }
        public Builder shippingCity(String v) { o.shippingCity = v; return this; }
        public Builder shippingState(String v) { o.shippingState = v; return this; }
        public Builder shippingZip(String v) { o.shippingZip = v; return this; }
        public Builder notes(String v) { o.notes = v; return this; }
        public Order build() { return o; }
    }

    public Long getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public User getUser() { return user; }
    public List<OrderItem> getItems() { return items; }
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

    public void setItems(List<OrderItem> v) { this.items = v; }
    public void setStatus(OrderStatus v) { this.status = v; }
    public void setDeliveredAt(LocalDateTime v) { this.deliveredAt = v; }
    public void setPaymentStatus(PaymentStatus v) { this.paymentStatus = v; }
}
