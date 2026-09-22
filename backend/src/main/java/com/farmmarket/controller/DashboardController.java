package com.farmmarket.controller;

import com.farmmarket.dto.AdminStatsResponse;
import com.farmmarket.dto.ProfitSummaryResponse;
import com.farmmarket.entity.User;
import com.farmmarket.service.DashboardService;
import com.farmmarket.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/farmer/dashboard/profit")
    public ResponseEntity<ProfitSummaryResponse> getFarmerProfit(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(dashboardService.getFarmerProfitSummary(user.getId()));
    }

    @GetMapping("/farmer/dashboard/summary")
    public ResponseEntity<ProfitSummaryResponse> getFarmerSummary(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(dashboardService.getFarmerProfitSummary(user.getId()));
    }

    @GetMapping("/admin/dashboard/stats")
    public ResponseEntity<AdminStatsResponse> getAdminDashboardStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }
}
