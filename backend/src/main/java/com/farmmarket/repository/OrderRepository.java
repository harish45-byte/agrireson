package com.farmmarket.repository;

import com.farmmarket.entity.Order;
import com.farmmarket.entity.OrderStatus;
import com.farmmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerOrderByOrderDateDesc(User buyer);
    List<Order> findByBuyerIdOrderByOrderDateDesc(Long buyerId);
    List<Order> findAllByOrderByOrderDateDesc();
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status != 'CANCELLED'")
    Double calculateTotalMarketplaceGMV();
}
