package com.bookstore.service;

import com.bookstore.dto.OrderDto;
import com.bookstore.dto.OrderRequest;
import com.bookstore.entity.*;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookService bookService;
    private final AuthService authService;

    public OrderService(OrderRepository orderRepository, BookRepository bookRepository,
                        UserRepository userRepository, BookService bookService, AuthService authService) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.bookService = bookService;
        this.authService = authService;
    }

    @Transactional
    public OrderDto placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequest.CartItemRequest cartItem : request.getItems()) {
            Book book = bookRepository.findById(cartItem.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + cartItem.getBookId()));
            if (book.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + book.getTitle());
            }
            BigDecimal itemTotal = book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            OrderItem item = OrderItem.builder()
                    .book(book).quantity(cartItem.getQuantity())
                    .unitPrice(book.getPrice()).totalPrice(itemTotal).build();
            items.add(item);
            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());
            bookRepository.save(book);
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal tax = subtotal.multiply(new BigDecimal("0.08"));
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("50")) > 0 ? BigDecimal.ZERO : new BigDecimal("4.99");
        BigDecimal total = subtotal.add(tax).add(shipping);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user).subtotal(subtotal).tax(tax).shippingCharge(shipping)
                .discount(BigDecimal.ZERO).totalAmount(total)
                .status(OrderStatus.CONFIRMED).paymentStatus(PaymentStatus.COMPLETED)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress()).shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState()).shippingZip(request.getShippingZip())
                .notes(request.getNotes()).build();

        Order savedOrder = orderRepository.save(order);
        items.forEach(item -> item.setOrder(savedOrder));
        savedOrder.setItems(items);
        orderRepository.save(savedOrder);

        log.info("Order placed: {} for user: {}", savedOrder.getOrderNumber(), email);
        return mapToDto(savedOrder);
    }

    public Page<OrderDto> getUserOrders(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size)).map(this::mapToDto);
    }

    public OrderDto getOrderById(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getEmail().equals(email)) throw new BadRequestException("Access denied");
        return mapToDto(order);
    }

    public Page<OrderDto> getAllOrders(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size)).map(this::mapToDto);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) order.setDeliveredAt(LocalDateTime.now());
        return mapToDto(orderRepository.save(order));
    }

    public OrderDto mapToDto(Order order) {
        List<OrderDto.OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderDto.OrderItemDto.builder()
                        .id(item.getId()).book(bookService.mapToDto(item.getBook()))
                        .quantity(item.getQuantity()).unitPrice(item.getUnitPrice()).totalPrice(item.getTotalPrice())
                        .build()).toList();
        return OrderDto.builder()
                .id(order.getId()).orderNumber(order.getOrderNumber())
                .user(authService.mapToDto(order.getUser()))
                .items(itemDtos).subtotal(order.getSubtotal()).discount(order.getDiscount())
                .tax(order.getTax()).shippingCharge(order.getShippingCharge()).totalAmount(order.getTotalAmount())
                .status(order.getStatus()).paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress()).shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState()).shippingZip(order.getShippingZip())
                .notes(order.getNotes()).createdAt(order.getCreatedAt()).deliveredAt(order.getDeliveredAt())
                .build();
    }
}
