package com.farmmarket.controller;

import com.farmmarket.dto.ProductRequest;
import com.farmmarket.dto.ProductResponse;
import com.farmmarket.entity.Role;
import com.farmmarket.entity.User;
import com.farmmarket.service.ProductService;
import com.farmmarket.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    public ProductController(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        if (categoryId != null || keyword != null || minPrice != null || maxPrice != null) {
            return ResponseEntity.ok(productService.filterProducts(categoryId, keyword, minPrice, maxPrice));
        }
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<ProductResponse>> getFarmerProducts(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(productService.getProductsByFarmerId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(productService.createProduct(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        return ResponseEntity.ok(productService.updateProduct(id, user.getId(), isAdmin, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        productService.deleteProduct(id, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Double> payload,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        Double quantity = payload.get("quantity");
        if (quantity == null) {
            throw new IllegalArgumentException("Quantity field is required");
        }
        return ResponseEntity.ok(productService.updateStock(id, user.getId(), isAdmin, quantity));
    }
}
