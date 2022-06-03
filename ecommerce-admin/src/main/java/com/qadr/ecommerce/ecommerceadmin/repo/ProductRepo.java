package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ProductRepo extends JpaRepository<Product, Integer> {


    @Query("SELECT p FROM Product p WHERE CONCAT(p.id, ' ', p.name, ' ', p.alias) LIKE %?1%")
    Page<Product> searchKeyword(String keyword, Pageable pageable);


    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.enabled=?2 WHERE p.id=?1")
    void setEnabledStatus(int id, boolean isEnabled);

    Optional<Product> findByName(String name);

    Optional<Product> findByAlias(String alias);

    @Query("SELECT p FROM Product p WHERE (p.category.id = ?2 OR "
            + "p.category.allParentIds LIKE %?3%) AND "
            + "( p.name LIKE %?1% "
            + "OR p.alias LIKE %?1% "
            + "OR p.brand.name LIKE %?1% "
            + "OR p.category.name LIKE %?1% "
            + "OR p.fullDescription LIKE %?1% "
            + "OR p.shortDescription LIKE %?1% )")
    Page<Product> findProduct(String keyword, Integer id, String catId, Pageable pageable);
}
