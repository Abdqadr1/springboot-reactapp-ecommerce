package com.qadr.ecommerce.sharedLibrary.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface SearchRepository<T, ID> extends JpaRepository<T, ID> {

    Page<T> searchKeyword(String keyword, Pageable pageable);

    Page<T> find(String keyword, Integer id, String catId, Pageable pageable);
}
