package com.farmmarket.service;

import com.farmmarket.dto.CropRequest;
import com.farmmarket.dto.CropResponse;
import com.farmmarket.entity.Crop;
import com.farmmarket.entity.User;
import com.farmmarket.repository.CropRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final UserService userService;

    public CropService(CropRepository cropRepository, UserService userService) {
        this.cropRepository = cropRepository;
        this.userService = userService;
    }

    public List<CropResponse> getCropsByFarmerId(Long farmerId) {
        return cropRepository.findByFarmerId(farmerId).stream()
                .map(CropResponse::new)
                .collect(Collectors.toList());
    }

    public Crop getCropEntityById(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found with ID: " + id));
    }

    public CropResponse getCropById(Long id) {
        return new CropResponse(getCropEntityById(id));
    }

    @Transactional
    public CropResponse createCrop(Long farmerId, CropRequest request) {
        User farmer = userService.getUserById(farmerId);
        Crop crop = new Crop(
                null,
                farmer,
                request.getCropName().trim(),
                request.getArea(),
                request.getPlantingDate(),
                request.getHarvestDate(),
                request.getStatus()
        );
        return new CropResponse(cropRepository.save(crop));
    }

    @Transactional
    public CropResponse updateCrop(Long id, Long farmerId, CropRequest request) {
        Crop crop = getCropEntityById(id);
        if (!crop.getFarmer().getId().equals(farmerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this crop");
        }
        crop.setCropName(request.getCropName().trim());
        crop.setArea(request.getArea());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setHarvestDate(request.getHarvestDate());
        crop.setStatus(request.getStatus());
        return new CropResponse(cropRepository.save(crop));
    }

    @Transactional
    public void deleteCrop(Long id, Long farmerId) {
        Crop crop = getCropEntityById(id);
        if (!crop.getFarmer().getId().equals(farmerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this crop");
        }
        cropRepository.delete(crop);
    }
}
