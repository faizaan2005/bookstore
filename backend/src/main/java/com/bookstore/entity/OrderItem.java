package com.bookstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal unitPrice;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal totalPrice;

    public OrderItem() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OrderItem i = new OrderItem();
        public Builder book(Book v) { i.book = v; return this; }
        public Builder quantity(Integer v) { i.quantity = v; return this; }
        public Builder unitPrice(BigDecimal v) { i.unitPrice = v; return this; }
        public Builder totalPrice(BigDecimal v) { i.totalPrice = v; return this; }
        public OrderItem build() { return i; }
    }

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Book getBook() { return book; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getTotalPrice() { return totalPrice; }

    public void setOrder(Order v) { this.order = v; }
}
