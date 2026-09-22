package com.farmmarket;

import com.farmmarket.dto.*;
import com.farmmarket.entity.ExpenseType;
import com.farmmarket.entity.Product;
import com.farmmarket.entity.Role;
import com.farmmarket.entity.User;
import com.farmmarket.repository.ProductRepository;
import com.farmmarket.repository.UserRepository;
import com.farmmarket.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FarmMarketplaceApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private DashboardService dashboardService;

    @Test
    void contextLoads() {
        assertNotNull(userRepository);
        assertNotNull(dashboardService);
        assertNotNull(productService);
        assertNotNull(orderService);
    }

    @Test
    void testPromptProfitCalculationEquation() {
        // Seeds user prompt exact scenario:
        // Revenue = ₹28,000, Expenses = ₹12,500, Profit = ₹15,500
        User farmer = userRepository.findByEmail("farmer@farmmarket.com").orElse(null);
        assertNotNull(farmer, "Farmer should be seeded");
        assertEquals(Role.ROLE_FARMER, farmer.getRole());

        ProfitSummaryResponse summary = dashboardService.getFarmerProfitSummary(farmer.getId());
        assertEquals(28000.0, summary.getRevenue(), 0.01, "Total Revenue should equal ₹28,000");
        assertEquals(12500.0, summary.getExpenses(), 0.01, "Total Expense should equal ₹12,500");
        assertEquals(15500.0, summary.getProfit(), 0.01, "Net Profit should equal ₹15,500");
    }

    @Test
    void testAuthLoginAndTokenGeneration() {
        LoginRequest req = new LoginRequest("farmer@farmmarket.com", "farmer123");
        AuthResponse res = userService.login(req);

        assertNotNull(res.getToken());
        assertEquals("farmer@farmmarket.com", res.getEmail());
        assertEquals(Role.ROLE_FARMER, res.getRole());
    }

    @Test
    void testProductFiltering() {
        List<ProductResponse> filtered = productService.filterProducts(null, "Tomato", null, null);
        assertFalse(filtered.isEmpty(), "Should find at least one tomato product");
        assertTrue(filtered.get(0).getName().toLowerCase().contains("tomato"));
    }

    @Test
    void testOrderPlacementStockDeductionAndProfitUpdate() {
        User buyer = userRepository.findByEmail("buyer@farmmarket.com").orElseThrow();
        User farmer = userRepository.findByEmail("farmer@farmmarket.com").orElseThrow();

        // Get initial available mango product
        List<Product> mangoes = productRepository.findAll().stream()
                .filter(p -> p.getName().contains("Mango"))
                .toList();
        assertFalse(mangoes.isEmpty());
        Product mango = mangoes.get(0);
        double initialStock = mango.getQuantity();

        // Buy 10 kg
        OrderRequest orderReq = new OrderRequest(
                List.of(new OrderItemRequest(mango.getId(), 10.0)),
                "Civil Lines, Jaipur",
                "+91-9988776655",
                "UPI"
        );

        OrderResponse orderRes = orderService.createOrder(buyer.getId(), orderReq);
        assertNotNull(orderRes.getId());
        assertEquals(1800.0, orderRes.getTotalAmount(), 0.01);

        // Verify stock deducted
        Product updatedMango = productRepository.findById(mango.getId()).orElseThrow();
        assertEquals(initialStock - 10.0, updatedMango.getQuantity(), 0.01);

        // Verify that farmer revenue has now increased by ₹1,800
        ProfitSummaryResponse newSummary = dashboardService.getFarmerProfitSummary(farmer.getId());
        assertEquals(28000.0 + 1800.0, newSummary.getRevenue(), 0.01);
    }
}
