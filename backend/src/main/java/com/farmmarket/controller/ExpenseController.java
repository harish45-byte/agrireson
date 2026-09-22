package com.farmmarket.controller;

import com.farmmarket.dto.ExpenseRequest;
import com.farmmarket.dto.ExpenseResponse;
import com.farmmarket.entity.User;
import com.farmmarket.service.ExpenseService;
import com.farmmarket.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    public ExpenseController(ExpenseService expenseService, UserService userService) {
        this.expenseService = expenseService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getMyExpenses(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(expenseService.getExpensesByFarmerId(user.getId()));
    }

    @GetMapping("/crop/{cropId}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCrop(
            @PathVariable Long cropId,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(expenseService.getExpensesByCropId(user.getId(), cropId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(expenseService.createExpense(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(expenseService.updateExpense(id, user.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        expenseService.deleteExpense(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
