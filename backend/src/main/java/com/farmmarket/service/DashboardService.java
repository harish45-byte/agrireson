package com.farmmarket.service;

import com.farmmarket.dto.*;
import com.farmmarket.entity.Crop;
import com.farmmarket.entity.ExpenseType;
import com.farmmarket.entity.OrderStatus;
import com.farmmarket.entity.Role;
import com.farmmarket.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderItemRepository orderItemRepository;
    private final ExpenseRepository expenseRepository;
    private final ProductRepository productRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardService(OrderItemRepository orderItemRepository,
                            ExpenseRepository expenseRepository,
                            ProductRepository productRepository,
                            CropRepository cropRepository,
                            OrderRepository orderRepository,
                            UserRepository userRepository) {
        this.orderItemRepository = orderItemRepository;
        this.expenseRepository = expenseRepository;
        this.productRepository = productRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public ProfitSummaryResponse getFarmerProfitSummary(Long farmerId) {
        // 1. Calculate Total Revenue from sales
        Double rawRevenue = orderItemRepository.calculateTotalRevenueByFarmerId(farmerId);
        double totalRevenue = round(rawRevenue != null ? rawRevenue : 0.0);

        // 2. Calculate Total Expenses
        Double rawExpense = expenseRepository.calculateTotalExpenseByFarmerId(farmerId);
        double totalExpenses = round(rawExpense != null ? rawExpense : 0.0);

        // 3. Profit = Total Revenue - Total Expenses
        double netProfit = round(totalRevenue - totalExpenses);

        // 4. Profit Margin % = (Net Profit / Total Revenue) * 100
        double profitMargin = totalRevenue > 0 ? round((netProfit / totalRevenue) * 100.0) : 0.0;

        // 5. Products sold (total quantity)
        Double rawSold = orderItemRepository.calculateTotalQuantitySoldByFarmerId(farmerId);
        double productsSold = round(rawSold != null ? rawSold : 0.0);

        // 6. Active products
        long activeProducts = productRepository.countByFarmerId(farmerId);

        // 7. Orders count
        var farmerOrderItems = orderItemRepository.findByFarmerIdOrderByOrderOrderDateDesc(farmerId);
        long pendingOrders = farmerOrderItems.stream()
                .filter(item -> item.getOrder() != null && item.getOrder().getStatus() == OrderStatus.PENDING)
                .map(item -> item.getOrder().getId())
                .distinct()
                .count();

        long totalOrders = farmerOrderItems.stream()
                .filter(item -> item.getOrder() != null)
                .map(item -> item.getOrder().getId())
                .distinct()
                .count();

        // 8. Expense Breakdown by ExpenseType
        List<ExpenseDistributionDto> expenseBreakdown = new ArrayList<>();
        List<Object[]> distributionData = expenseRepository.calculateExpenseDistributionByFarmerId(farmerId);
        for (Object[] row : distributionData) {
            ExpenseType type = (ExpenseType) row[0];
            Double amount = (Double) row[1];
            double percentage = totalExpenses > 0 ? round((amount / totalExpenses) * 100.0) : 0.0;
            expenseBreakdown.add(new ExpenseDistributionDto(type, round(amount), percentage));
        }

        // 9. Crop-specific profitability
        List<CropProfitResponse> cropProfits = new ArrayList<>();
        List<Crop> crops = cropRepository.findByFarmerId(farmerId);
        for (Crop crop : crops) {
            var cropOrderItems = orderItemRepository.findByFarmerIdAndCropId(farmerId, crop.getId());
            double cropRevenue = round(cropOrderItems.stream().mapToDouble(item -> item.getSubtotal()).sum());

            Double rawCropExp = expenseRepository.calculateTotalExpenseByCropId(farmerId, crop.getId());
            double cropExpenses = round(rawCropExp != null ? rawCropExp : 0.0);

            double cropProfit = round(cropRevenue - cropExpenses);
            double cropMargin = cropRevenue > 0 ? round((cropProfit / cropRevenue) * 100.0) : 0.0;

            cropProfits.add(new CropProfitResponse(
                    crop.getId(),
                    crop.getCropName(),
                    crop.getArea(),
                    cropRevenue,
                    cropExpenses,
                    cropProfit,
                    cropMargin
            ));
        }

        ProfitSummaryResponse response = new ProfitSummaryResponse(
                totalRevenue,
                totalExpenses,
                netProfit,
                profitMargin,
                productsSold,
                activeProducts,
                pendingOrders,
                totalOrders
        );
        response.setExpenseBreakdown(expenseBreakdown);
        response.setCropProfits(cropProfits);

        return response;
    }

    public AdminStatsResponse getAdminStats() {
        long totalFarmers = userRepository.countByRole(Role.ROLE_FARMER);
        long totalBuyers = userRepository.countByRole(Role.ROLE_BUYER);
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        Double rawGMV = orderRepository.calculateTotalMarketplaceGMV();
        double totalGMV = round(rawGMV != null ? rawGMV : 0.0);

        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);

        return new AdminStatsResponse(
                totalFarmers,
                totalBuyers,
                totalProducts,
                totalOrders,
                totalGMV,
                pendingOrders,
                deliveredOrders
        );
    }

    private double round(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
