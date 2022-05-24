package com.qadr.ecommerceadmin.repo;

import com.qadr.ecommerceadmin.model.Brand;
import com.qadr.ecommerceadmin.model.Product;
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
}
