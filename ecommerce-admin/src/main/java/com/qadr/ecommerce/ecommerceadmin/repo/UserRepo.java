package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.repo.SearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepo extends SearchRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.enabled=?2 WHERE u.id=?1")
    void setUserEnableStatus(Long id, boolean isEnabled);

    @Query("SELECT u FROM User u WHERE CONCAT(u.id, ' ', u.firstName," +
            " ' ', u.lastName, ' ', u.email) LIKE %?1%")
    Page<User> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT u FROM User u")
    Page<User> find(String keyword, Integer id, String catId, Pageable pageable);
}
