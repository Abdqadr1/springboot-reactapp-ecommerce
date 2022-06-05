package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.enabled = true AND (" +
            "p.category.id = ?1 OR p.category.allParentIds LIKE %?2%)")
    Page<Product> getCategoryProducts(Integer id, String ids, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.alias = ?1 AND p.enabled = true")
    Optional<Product> findByAlias(String alias);

    @Query(
            value = "SELECT * FROM products WHERE enabled=true AND MATCH (name, short_description, full_description) AGAINST (?1)",
            nativeQuery = true
    )
    Page<Product> searchKeyword(String keyword, Pageable pageable);
}
