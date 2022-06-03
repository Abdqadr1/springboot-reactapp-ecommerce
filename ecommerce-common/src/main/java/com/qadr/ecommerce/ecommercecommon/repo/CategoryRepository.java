package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c FROM Category c WHERE c.enabled=true ORDER BY c.name ASC")
    List<com.qadr.ecommerce.sharedLibrary.entities.Category> findAllEnabled();

    @Query("SELECT c FROM Category c WHERE c.alias=?1 AND c.enabled=true")
    Optional<Category> findByAlias (String alias);
}
