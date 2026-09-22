package com.farmmarket.service;

import com.farmmarket.dto.OrderItemRequest;
import com.farmmarket.dto.OrderItemResponse;
import com.farmmarket.dto.OrderRequest;
import com.farmmarket.dto.OrderResponse;
import com.farmmarket.entity.*;
import com.farmmarket.repository.OrderItemRepository;
import com.farmmarket.repository.OrderRepository;
import com.farmmarket.repository.ProductRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        UserService userService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @Transactional
    public OrderResponse createOrder(Long buyerId, OrderRequest request) {
        User buyer = userService.getUserById(buyerId);

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(request.getShippingAddress());
        order.setContactPhone(request.getContactPhone());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash on Delivery");

        double totalAmount = 0.0;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.getProductId()));

            if (!product.getActive()) {
                throw new IllegalStateException("Product is no longer available: " + product.getName());
            }

            if (product.getQuantity() < itemReq.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product '" + product.getName() + "'. Available: " + product.getQuantity() + " " + product.getUnit());
            }

            // Deduct stock
            double remainingQty = product.getQuantity() - itemReq.getQuantity();
            product.setQuantity(remainingQty);
            if (remainingQty == 0) {
                product.setActive(false);
            }
            productRepository.save(product);

            double subtotal = product.getPrice() * itemReq.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = new OrderItem(
                    null,
                    order,
                    product,
                    product.getFarmer(),
                    itemReq.getQuantity(),
                    product.getPrice(),
                    subtotal
            );
            items.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(items);

        Order savedOrder = orderRepository.save(order);
        return new OrderResponse(savedOrder);
    }

    public List<OrderResponse> getBuyerOrders(Long buyerId) {
        return orderRepository.findByBuyerIdOrderByOrderDateDesc(buyerId).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public List<OrderItemResponse> getFarmerOrderItems(Long farmerId) {
        return orderItemRepository.findByFarmerIdOrderByOrderOrderDateDesc(farmerId).stream()
                .map(OrderItemResponse::new)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId, Role userRole) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        if (userRole == Role.ROLE_ADMIN) {
            return new OrderResponse(order);
        }

        if (userRole == Role.ROLE_BUYER && order.getBuyer().getId().equals(userId)) {
            return new OrderResponse(order);
        }

        if (userRole == Role.ROLE_FARMER) {
            boolean hasFarmerProduct = order.getOrderItems().stream()
                    .anyMatch(oi -> oi.getFarmer().getId().equals(userId));
            if (hasFarmerProduct) {
                return new OrderResponse(order);
            }
        }

        throw new AccessDeniedException("You are not authorized to view this order");
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        order.setStatus(status);
        return new OrderResponse(orderRepository.save(order));
    }
}
