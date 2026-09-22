package com.farmmarket.service;

import com.farmmarket.dto.CategoryDto;
import com.farmmarket.entity.Category;
import com.farmmarket.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::new)
                .collect(Collectors.toList());
    }

    public Category getCategoryEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + id));
    }

    public CategoryDto getCategoryById(Long id) {
        return new CategoryDto(getCategoryEntityById(id));
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new IllegalArgumentException("Category already exists: " + dto.getName());
        }
        Category category = new Category(
                null,
                dto.getName().trim(),
                dto.getDescription(),
                dto.getIcon()
        );
        return new CategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = getCategoryEntityById(id);
        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        return new CategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
