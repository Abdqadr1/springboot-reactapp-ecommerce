package com.qadr.ecommerceadmin.repo;

import com.qadr.ecommerceadmin.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BrandRepo extends JpaRepository<Brand, Integer> {


    @Query("SELECT b FROM Brand b WHERE CONCAT(b.id, ' ', b.name) LIKE %?1%")
    Page<Brand> searchKeyword(String keyword, Pageable pageable);

    Optional<Brand> findByName(String name);

    @Query("SELECT NEW Brand(b.id, b.name) FROM Brand b ORDER BY b.name ASC")
    List<Brand> findAll();
}
