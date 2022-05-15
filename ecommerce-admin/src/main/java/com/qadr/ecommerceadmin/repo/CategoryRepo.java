package com.qadr.ecommerceadmin.repo;

import com.qadr.ecommerceadmin.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {

    @Query("SELECT c FROM Category c WHERE CONCAT(c.name, ' ', c.alias) LIKE %?1%")
    Page<Category> searchKeyword(String keyword, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Category c SET c.enabled=?2 WHERE c.id=?1")
    void updateStatus(Integer id, boolean status);
}
