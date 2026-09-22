package com.farmmarket.repository;

import com.farmmarket.entity.Expense;
import com.farmmarket.entity.ExpenseType;
import com.farmmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByFarmer(User farmer);
    List<Expense> findByFarmerIdOrderByExpenseDateDesc(Long farmerId);
    List<Expense> findByFarmerIdAndCropId(Long farmerId, Long cropId);
    List<Expense> findByFarmerIdAndExpenseType(Long farmerId, ExpenseType expenseType);

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.farmer.id = :farmerId")
    Double calculateTotalExpenseByFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT e.expenseType, COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.farmer.id = :farmerId GROUP BY e.expenseType")
    List<Object[]> calculateExpenseDistributionByFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.farmer.id = :farmerId AND e.crop.id = :cropId")
    Double calculateTotalExpenseByCropId(@Param("farmerId") Long farmerId, @Param("cropId") Long cropId);
}
