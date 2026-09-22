package com.farmmarket.service;

import com.farmmarket.dto.ExpenseRequest;
import com.farmmarket.dto.ExpenseResponse;
import com.farmmarket.entity.Crop;
import com.farmmarket.entity.Expense;
import com.farmmarket.entity.User;
import com.farmmarket.repository.CropRepository;
import com.farmmarket.repository.ExpenseRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CropRepository cropRepository;
    private final UserService userService;

    public ExpenseService(ExpenseRepository expenseRepository,
                          CropRepository cropRepository,
                          UserService userService) {
        this.expenseRepository = expenseRepository;
        this.cropRepository = cropRepository;
        this.userService = userService;
    }

    public List<ExpenseResponse> getExpensesByFarmerId(Long farmerId) {
        return expenseRepository.findByFarmerIdOrderByExpenseDateDesc(farmerId).stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getExpensesByCropId(Long farmerId, Long cropId) {
        return expenseRepository.findByFarmerIdAndCropId(farmerId, cropId).stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    public Expense getExpenseEntityById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with ID: " + id));
    }

    public ExpenseResponse getExpenseById(Long id) {
        return new ExpenseResponse(getExpenseEntityById(id));
    }

    @Transactional
    public ExpenseResponse createExpense(Long farmerId, ExpenseRequest request) {
        User farmer = userService.getUserById(farmerId);
        Crop crop = null;
        if (request.getCropId() != null) {
            crop = cropRepository.findById(request.getCropId()).orElse(null);
        }

        Expense expense = new Expense(
                null,
                farmer,
                crop,
                request.getExpenseType(),
                request.getAmount(),
                request.getDescription(),
                request.getExpenseDate()
        );

        return new ExpenseResponse(expenseRepository.save(expense));
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, Long farmerId, ExpenseRequest request) {
        Expense expense = getExpenseEntityById(id);
        if (!expense.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You are not authorized to update this expense");
        }

        Crop crop = null;
        if (request.getCropId() != null) {
            crop = cropRepository.findById(request.getCropId()).orElse(null);
        }

        expense.setCrop(crop);
        expense.setExpenseType(request.getExpenseType());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());

        return new ExpenseResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Long id, Long farmerId) {
        Expense expense = getExpenseEntityById(id);
        if (!expense.getFarmer().getId().equals(farmerId)) {
            throw new AccessDeniedException("You are not authorized to delete this expense");
        }
        expenseRepository.delete(expense);
    }
}
