package com.farmmarket.repository;

import com.farmmarket.entity.Crop;
import com.farmmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmer(User farmer);
    List<Crop> findByFarmerId(Long farmerId);
}
