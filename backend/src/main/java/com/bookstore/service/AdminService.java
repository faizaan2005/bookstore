package com.bookstore.service;

import com.bookstore.dto.DashboardStats;
import com.bookstore.dto.UserDto;
import com.bookstore.entity.OrderStatus;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final AuthService authService;

    public AdminService(UserRepository userRepository, BookRepository bookRepository,
                        OrderRepository orderRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
        this.authService = authService;
    }

    public DashboardStats getDashboardStats() {
        Map<String, Long> ordersByStatus = new HashMap<>();
        orderRepository.countByStatus().forEach(row -> ordersByStatus.put(row[0].toString(), (Long) row[1]));

        Map<String, BigDecimal> revenueByMonth = new HashMap<>();
        orderRepository.getMonthlyRevenue().forEach(row ->
                revenueByMonth.put("Month-" + row[0], (BigDecimal) row[1]));

        Map<String, Long> booksByCategory = new HashMap<>();
        bookRepository.countByCategory().forEach(row -> booksByCategory.put(row[0].toString(), (Long) row[1]));

        return DashboardStats.builder()
                .totalUsers(userRepository.countByEnabledTrue())
                .totalBooks(bookRepository.countByActiveTrue())
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.calculateTotalRevenue())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .deliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED))
                .outOfStockBooks(bookRepository.countByStockQuantityEqualsAndActiveTrue(0))
                .ordersByStatus(ordersByStatus)
                .revenueByMonth(revenueByMonth)
                .booksByCategory(booksByCategory)
                .build();
    }

    public Page<UserDto> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(authService::mapToDto);
    }

    @Transactional
    public UserDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        return authService.mapToDto(userRepository.save(user));
    }
}
