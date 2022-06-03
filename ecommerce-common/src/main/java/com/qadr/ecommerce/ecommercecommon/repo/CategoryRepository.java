package com.qadr.ecommercecommon.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<com.qadr.ecommerce.sharedLibrary.entities.Category, Integer> {

    @Query("SELECT c FROM Category c WHERE c.enabled=true ORDER BY c.name ASC")
    List<com.qadr.ecommerce.sharedLibrary.entities.Category> findAllEnabled();
}
