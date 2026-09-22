package com.farmmarket.service;

import com.farmmarket.dto.ProductRequest;
import com.farmmarket.dto.ProductResponse;
import com.farmmarket.entity.Category;
import com.farmmarket.entity.Crop;
import com.farmmarket.entity.Product;
import com.farmmarket.entity.User;
import com.farmmarket.repository.CropRepository;
import com.farmmarket.repository.ProductRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final CropRepository cropRepository;
    private final UserService userService;

    public ProductService(ProductRepository productRepository,
                          CategoryService categoryService,
                          CropRepository cropRepository,
                          UserService userService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.cropRepository = cropRepository;
        this.userService = userService;
    }

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByActiveTrue().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> filterProducts(Long categoryId, String keyword, Double minPrice, Double maxPrice) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        return productRepository.filterProducts(categoryId, cleanKeyword, minPrice, maxPrice).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
    }

    public ProductResponse getProductById(Long id) {
        return new ProductResponse(getProductEntityById(id));
    }

    public List<ProductResponse> getProductsByFarmerId(Long farmerId) {
        return productRepository.findByFarmerId(farmerId).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(Long farmerId, ProductRequest request) {
        User farmer = userService.getUserById(farmerId);
        Category category = categoryService.getCategoryEntityById(request.getCategoryId());
        Crop crop = null;
        if (request.getCropId() != null) {
            crop = cropRepository.findById(request.getCropId()).orElse(null);
        }

        Product product = new Product(
                null,
                farmer,
                category,
                crop,
                request.getName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getQuantity(),
                request.getUnit(),
                request.getHarvestDate(),
                request.getImageUrl(),
                request.getActive()
        );

        return new ProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, Long farmerId, boolean isAdmin, ProductRequest request) {
        Product product = getProductEntityById(id);
        if (!isAdmin && !product.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You are not authorized to update this product");
        }

        Category category = categoryService.getCategoryEntityById(request.getCategoryId());
        Crop crop = null;
        if (request.getCropId() != null) {
            crop = cropRepository.findById(request.getCropId()).orElse(null);
        }

        product.setCategory(category);
        product.setCrop(crop);
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setUnit(request.getUnit());
        product.setHarvestDate(request.getHarvestDate());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }

        return new ProductResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id, Long farmerId, boolean isAdmin) {
        Product product = getProductEntityById(id);
        if (!isAdmin && !product.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You are not authorized to delete this product");
        }
        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse updateStock(Long id, Long farmerId, boolean isAdmin, Double quantity) {
        Product product = getProductEntityById(id);
        if (!isAdmin && !product.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You are not authorized to update stock for this product");
        }
        if (quantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }
        product.setQuantity(quantity);
        if (quantity == 0) {
            product.setActive(false);
        }
        return new ProductResponse(productRepository.save(product));
    }
}
