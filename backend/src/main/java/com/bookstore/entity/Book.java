package com.bookstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "books")
public class Book {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String author;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price;
    @Column(precision = 10, scale = 2) private BigDecimal originalPrice;
    private String category;
    private String isbn;
    private String publisher;
    private String language;
    private Integer pages;
    private String imageUrl;
    @Column(nullable = false) private Integer stockQuantity = 0;
    private Double rating = 0.0;
    private Integer reviewCount = 0;
    @Column(nullable = false) private boolean featured = false;
    @Column(nullable = false) private boolean active = true;
    @Column(updatable = false) private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    @ManyToMany(mappedBy = "wishlist", fetch = FetchType.LAZY)
    private Set<User> wishedByUsers = new HashSet<>();

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Book() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Book b = new Book();
        public Builder title(String v) { b.title = v; return this; }
        public Builder author(String v) { b.author = v; return this; }
        public Builder description(String v) { b.description = v; return this; }
        public Builder price(BigDecimal v) { b.price = v; return this; }
        public Builder originalPrice(BigDecimal v) { b.originalPrice = v; return this; }
        public Builder category(String v) { b.category = v; return this; }
        public Builder isbn(String v) { b.isbn = v; return this; }
        public Builder publisher(String v) { b.publisher = v; return this; }
        public Builder language(String v) { b.language = v; return this; }
        public Builder pages(Integer v) { b.pages = v; return this; }
        public Builder imageUrl(String v) { b.imageUrl = v; return this; }
        public Builder stockQuantity(int v) { b.stockQuantity = v; return this; }
        public Builder rating(double v) { b.rating = v; return this; }
        public Builder reviewCount(int v) { b.reviewCount = v; return this; }
        public Builder featured(boolean v) { b.featured = v; return this; }
        public Builder active(boolean v) { b.active = v; return this; }
        public Book build() { return b; }
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getOriginalPrice() { return originalPrice; }
    public String getCategory() { return category; }
    public String getIsbn() { return isbn; }
    public String getPublisher() { return publisher; }
    public String getLanguage() { return language; }
    public Integer getPages() { return pages; }
    public String getImageUrl() { return imageUrl; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Double getRating() { return rating; }
    public Integer getReviewCount() { return reviewCount; }
    public boolean isFeatured() { return featured; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean isInStock() { return stockQuantity > 0; }

    public void setTitle(String v) { this.title = v; }
    public void setAuthor(String v) { this.author = v; }
    public void setDescription(String v) { this.description = v; }
    public void setPrice(BigDecimal v) { this.price = v; }
    public void setOriginalPrice(BigDecimal v) { this.originalPrice = v; }
    public void setCategory(String v) { this.category = v; }
    public void setIsbn(String v) { this.isbn = v; }
    public void setPublisher(String v) { this.publisher = v; }
    public void setLanguage(String v) { this.language = v; }
    public void setPages(Integer v) { this.pages = v; }
    public void setImageUrl(String v) { this.imageUrl = v; }
    public void setStockQuantity(Integer v) { this.stockQuantity = v; }
    public void setRating(Double v) { this.rating = v; }
    public void setReviewCount(Integer v) { this.reviewCount = v; }
    public void setFeatured(boolean v) { this.featured = v; }
    public void setActive(boolean v) { this.active = v; }
}
