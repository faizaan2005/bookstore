package com.bookstore.dto;

import java.math.BigDecimal;

public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String category;
    private String isbn;
    private String publisher;
    private String language;
    private Integer pages;
    private String imageUrl;
    private Integer stockQuantity;
    private Double rating;
    private Integer reviewCount;
    private boolean featured;
    private boolean active;
    private boolean inStock;

    public BookDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final BookDto d = new BookDto();
        public Builder id(Long v) { d.id = v; return this; }
        public Builder title(String v) { d.title = v; return this; }
        public Builder author(String v) { d.author = v; return this; }
        public Builder description(String v) { d.description = v; return this; }
        public Builder price(BigDecimal v) { d.price = v; return this; }
        public Builder originalPrice(BigDecimal v) { d.originalPrice = v; return this; }
        public Builder category(String v) { d.category = v; return this; }
        public Builder isbn(String v) { d.isbn = v; return this; }
        public Builder publisher(String v) { d.publisher = v; return this; }
        public Builder language(String v) { d.language = v; return this; }
        public Builder pages(Integer v) { d.pages = v; return this; }
        public Builder imageUrl(String v) { d.imageUrl = v; return this; }
        public Builder stockQuantity(Integer v) { d.stockQuantity = v; return this; }
        public Builder rating(Double v) { d.rating = v; return this; }
        public Builder reviewCount(Integer v) { d.reviewCount = v; return this; }
        public Builder featured(boolean v) { d.featured = v; return this; }
        public Builder active(boolean v) { d.active = v; return this; }
        public Builder inStock(boolean v) { d.inStock = v; return this; }
        public BookDto build() { return d; }
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
    public boolean isInStock() { return inStock; }

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
    public void setFeatured(boolean v) { this.featured = v; }
    public void setActive(boolean v) { this.active = v; }
}
