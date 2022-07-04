package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ProductRepo extends SearchRepository<Product, Integer> {
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.enabled=?2 WHERE p.id=?1")
    void setEnabledStatus(int id, boolean isEnabled);

    Optional<Product> findByName(String name);

    @Query("SELECT p FROM Product p WHERE (p.category.id = ?2 OR "
            + "p.category.allParentIds LIKE %?3%) AND "
            + "( p.name LIKE %?1% "
            + "OR p.alias LIKE %?1% "
            + "OR p.brand.name LIKE %?1% "
            + "OR p.category.name LIKE %?1% "
            + "OR p.fullDescription LIKE %?1% "
            + "OR p.shortDescription LIKE %?1% )")
    Page<Product> find(String keyword, Integer id, String catId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.enabled = true AND (" +
            "p.category.id = ?1 OR p.category.allParentIds LIKE %?2%)")
    Page<Product> getCategoryProducts(Integer id, String ids, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.alias = ?1 AND p.enabled = true")
    Optional<Product> findByAlias(String alias);

    @Query(
            value = "SELECT * FROM `products` WHERE `enabled`=true AND MATCH (name, short_description, full_description) AGAINST (?1)",
            nativeQuery = true
    )
    Page<Product> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1%")
    Page<Product> search(String keyword, Pageable pageable);

    @Query("UPDATE Product p SET p.averageRating = " +
            "COALESCE((SELECT AVG(r.rating) FROM Review r WHERE r.product.id = ?1), 0), " +
            "p.reviewCount= COALESCE((SELECT COUNT(r.id) FROM Review r WHERE r.product.id = ?1), 0) " +
            "WHERE p.id = ?1")
    @Modifying
    void updateProductRating(Integer productId);

}
