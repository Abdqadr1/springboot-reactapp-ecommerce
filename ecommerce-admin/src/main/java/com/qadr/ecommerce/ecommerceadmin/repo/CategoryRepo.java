package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.ecommerceadmin.model.User;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.repo.SearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CategoryRepo extends SearchRepository<Category, Integer> {


    Optional<Category> findByName(String name);

    Optional<Category> findByAlias(String alias);

    @Query("SELECT c FROM Category c WHERE CONCAT(c.name, ' ', c.alias) LIKE %?1%")
    Page<Category> searchKeyword(String keyword, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Category c SET c.enabled=?2 WHERE c.id=?1")
    void updateStatus(Integer id, boolean status);

    @Query("SELECT u FROM User u")
    Page<Category> find(String keyword, Integer id, String catId, Pageable pageable);
}
