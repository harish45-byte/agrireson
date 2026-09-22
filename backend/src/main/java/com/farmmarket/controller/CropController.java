package com.farmmarket.controller;

import com.farmmarket.dto.CropRequest;
import com.farmmarket.dto.CropResponse;
import com.farmmarket.entity.User;
import com.farmmarket.service.CropService;
import com.farmmarket.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;
    private final UserService userService;

    public CropController(CropService cropService, UserService userService) {
        this.cropService = cropService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<CropResponse>> getMyCrops(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(cropService.getCropsByFarmerId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropResponse> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getCropById(id));
    }

    @PostMapping
    public ResponseEntity<CropResponse> createCrop(
            @Valid @RequestBody CropRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(cropService.createCrop(user.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CropResponse> updateCrop(
            @PathVariable Long id,
            @Valid @RequestBody CropRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(cropService.updateCrop(id, user.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        cropService.deleteCrop(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
