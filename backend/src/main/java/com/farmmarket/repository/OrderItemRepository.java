package com.farmmarket.repository;

import com.farmmarket.entity.OrderItem;
import com.farmmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByFarmer(User farmer);
    List<OrderItem> findByFarmerIdOrderByOrderOrderDateDesc(Long farmerId);

    @Query("SELECT COALESCE(SUM(oi.subtotal), 0.0) FROM OrderItem oi WHERE oi.farmer.id = :farmerId AND oi.order.status != 'CANCELLED'")
    Double calculateTotalRevenueByFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0.0) FROM OrderItem oi WHERE oi.farmer.id = :farmerId AND oi.order.status != 'CANCELLED'")
    Double calculateTotalQuantitySoldByFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.farmer.id = :farmerId AND oi.product.crop.id = :cropId AND oi.order.status != 'CANCELLED'")
    List<OrderItem> findByFarmerIdAndCropId(@Param("farmerId") Long farmerId, @Param("cropId") Long cropId);
}
