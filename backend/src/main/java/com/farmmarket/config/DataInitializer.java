package com.farmmarket.config;

import com.farmmarket.entity.*;
import com.farmmarket.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CropRepository cropRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ExpenseRepository expenseRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed-data:true}")
    private boolean seedData;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           CropRepository cropRepository,
                           ProductRepository productRepository,
                           OrderRepository orderRepository,
                           ExpenseRepository expenseRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.cropRepository = cropRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.expenseRepository = expenseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedData || userRepository.count() > 0) {
            return;
        }

        // 1. Seed Users
        User admin = new User(null, "System Administrator", "admin@farmmarket.com",
                passwordEncoder.encode("admin123"), Role.ROLE_ADMIN, "+91-9876543210", "Agri Market HQ, New Delhi");
        userRepository.save(admin);

        User farmer = new User(null, "Ramesh Kumar (Farmer)", "farmer@farmmarket.com",
                passwordEncoder.encode("farmer123"), Role.ROLE_FARMER, "+91-9811223344", "Green Valley Farm, Nashik, Maharashtra");
        userRepository.save(farmer);

        User buyer = new User(null, "Priya Sharma (Buyer)", "buyer@farmmarket.com",
                passwordEncoder.encode("buyer123"), Role.ROLE_BUYER, "+91-9877665544", "Flat 402, Sunshine Heights, Mumbai");
        userRepository.save(buyer);

        // 2. Seed Categories
        Category catVeg = categoryRepository.save(new Category(null, "Vegetables", "Fresh organic vegetables directly from farm", "Carrot"));
        Category catFruit = categoryRepository.save(new Category(null, "Fruits", "Seasonal, tree-ripened fresh fruits", "Apple"));
        Category catGrains = categoryRepository.save(new Category(null, "Grains & Cereals", "High quality farm wheat, rice, and millets", "Wheat"));
        Category catPulses = categoryRepository.save(new Category(null, "Pulses & Lentils", "Organic lentils and pulses", "Bean"));
        Category catDairy = categoryRepository.save(new Category(null, "Dairy & Organic", "Pure dairy, desi ghee, and organic honey", "Milk"));

        // 3. Seed Crops for Ramesh Kumar
        Crop cropTomato = cropRepository.save(new Crop(null, farmer, "Desi Hybrid Tomatoes", 2.5,
                LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(1), "ACTIVE"));
        Crop cropOnion = cropRepository.save(new Crop(null, farmer, "Nashik Red Onions", 3.0,
                LocalDate.now().minusMonths(4), LocalDate.now().minusWeeks(1), "HARVESTED"));
        Crop cropWheat = cropRepository.save(new Crop(null, farmer, "Sharbati Wheat", 5.0,
                LocalDate.now().minusMonths(6), LocalDate.now().minusMonths(1), "HARVESTED"));

        // 4. Seed Expenses for Ramesh Kumar (Matching Section 4 prompt specification)
        // Seeds: ₹2,000, Fertilizer: ₹3,000, Pesticides: ₹1,500, Labour: ₹5,000, Irrigation: ₹1,000 -> Total = ₹12,500
        expenseRepository.save(new Expense(null, farmer, cropTomato, ExpenseType.SEEDS, 2000.0, "Certified hybrid tomato seeds", LocalDate.now().minusDays(80)));
        expenseRepository.save(new Expense(null, farmer, cropTomato, ExpenseType.FERTILIZER, 3000.0, "Organic vermicompost and NPK", LocalDate.now().minusDays(60)));
        expenseRepository.save(new Expense(null, farmer, cropTomato, ExpenseType.PESTICIDES, 1500.0, "Neem-based eco bio-pesticide", LocalDate.now().minusDays(45)));
        expenseRepository.save(new Expense(null, farmer, cropTomato, ExpenseType.LABOUR, 5000.0, "Transplanting and weeding labour", LocalDate.now().minusDays(30)));
        expenseRepository.save(new Expense(null, farmer, cropTomato, ExpenseType.IRRIGATION, 1000.0, "Drip irrigation electricity & maintenance", LocalDate.now().minusDays(15)));

        // 5. Seed Products
        Product prodTomato = productRepository.save(new Product(null, farmer, catVeg, cropTomato,
                "Farm Fresh Organic Tomatoes", "Sun-ripened juicy red tomatoes grown with organic fertilizers.",
                40.0, 450.0, "kg", LocalDate.now().minusDays(2),
                "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80", true));

        Product prodOnion = productRepository.save(new Product(null, farmer, catVeg, cropOnion,
                "Nashik Grade-A Red Onions", "Directly from Maharashtra onion belt, long shelf-life.",
                32.0, 750.0, "kg", LocalDate.now().minusDays(5),
                "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80", true));

        Product prodMango = productRepository.save(new Product(null, farmer, catFruit, null,
                "Ratnagiri Alphonso Mangoes", "Naturally ripened sweet mangoes with unmatched aroma.",
                180.0, 120.0, "kg", LocalDate.now().minusDays(1),
                "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80", true));

        Product prodWheat = productRepository.save(new Product(null, farmer, catGrains, cropWheat,
                "Golden Sharbati Wheat Flour", "Stone-ground pure whole wheat flour, high fiber.",
                55.0, 800.0, "kg", LocalDate.now().minusDays(10),
                "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80", true));

        Product prodGhee = productRepository.save(new Product(null, farmer, catDairy, null,
                "A2 Desi Cow Bilona Ghee", "Traditional Vedic bilona method cultured butter ghee.",
                850.0, 25.0, "liter", LocalDate.now().minusDays(3),
                "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80", true));

        // 6. Seed Orders (Matching Section 4 prompt specification)
        // Tomato Sales = ₹20,000 (500 kg @ ₹40)
        // Onion Sales = ₹8,000 (250 kg @ ₹32)
        // Total Sales Revenue = ₹28,000
        Order order1 = new Order(null, buyer, 28000.0, OrderStatus.DELIVERED,
                "Flat 402, Sunshine Heights, Mumbai", "+91-9877665544", "UPI / NetBanking");
        order1.setOrderDate(LocalDateTime.now().minusDays(4));

        OrderItem itemTomato = new OrderItem(null, order1, prodTomato, farmer, 500.0, 40.0, 20000.0);
        OrderItem itemOnion = new OrderItem(null, order1, prodOnion, farmer, 250.0, 32.0, 8000.0);
        order1.setOrderItems(List.of(itemTomato, itemOnion));

        orderRepository.save(order1);
    }
}
