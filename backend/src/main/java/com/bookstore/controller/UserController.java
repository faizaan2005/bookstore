package com.bookstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.dto.OrderDto;
import com.bookstore.dto.OrderRequest;
import com.bookstore.dto.UserDto;
import com.bookstore.entity.User;
import com.bookstore.service.AuthService;
import com.bookstore.service.OrderService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final OrderService orderService;
    private final AuthService authService;

    public UserController(OrderService orderService,
                          AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(authService.mapToDto(user));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDto> placeOrder(
            @AuthenticationPrincipal User user,
            @RequestBody OrderRequest request) {

        return ResponseEntity.ok(
                orderService.placeOrder(
                        user.getEmail(),
                        request
                )
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> getOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                orderService.getUserOrders(
                        user.getEmail(),
                        page,
                        size
                )
        );
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getOrderById(
                        id,
                        user.getEmail()
                )
        );
    }
}