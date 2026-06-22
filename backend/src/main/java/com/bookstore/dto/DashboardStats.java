package com.bookstore.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStats {
    private long totalUsers;
    private long totalBooks;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long deliveredOrders;
    private long outOfStockBooks;
    private Map<String, Long> ordersByStatus;
    private Map<String, BigDecimal> revenueByMonth;
    private Map<String, Long> booksByCategory;

    public DashboardStats() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DashboardStats d = new DashboardStats();
        public Builder totalUsers(long v) { d.totalUsers = v; return this; }
        public Builder totalBooks(long v) { d.totalBooks = v; return this; }
        public Builder totalOrders(long v) { d.totalOrders = v; return this; }
        public Builder totalRevenue(BigDecimal v) { d.totalRevenue = v; return this; }
        public Builder pendingOrders(long v) { d.pendingOrders = v; return this; }
        public Builder deliveredOrders(long v) { d.deliveredOrders = v; return this; }
        public Builder outOfStockBooks(long v) { d.outOfStockBooks = v; return this; }
        public Builder ordersByStatus(Map<String, Long> v) { d.ordersByStatus = v; return this; }
        public Builder revenueByMonth(Map<String, BigDecimal> v) { d.revenueByMonth = v; return this; }
        public Builder booksByCategory(Map<String, Long> v) { d.booksByCategory = v; return this; }
        public DashboardStats build() { return d; }
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalBooks() { return totalBooks; }
    public long getTotalOrders() { return totalOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public long getPendingOrders() { return pendingOrders; }
    public long getDeliveredOrders() { return deliveredOrders; }
    public long getOutOfStockBooks() { return outOfStockBooks; }
    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public Map<String, BigDecimal> getRevenueByMonth() { return revenueByMonth; }
    public Map<String, Long> getBooksByCategory() { return booksByCategory; }
}
