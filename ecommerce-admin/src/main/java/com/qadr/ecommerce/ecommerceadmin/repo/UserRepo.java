package com.qadr.ecommerceadmin.repo;

import com.qadr.ecommerceadmin.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.enabled=?2 WHERE u.id=?1")
    void setUserEnableStatus(Long id, boolean isEnabled);

    @Query("SELECT u FROM User u WHERE CONCAT(u.id, ' ', u.firstName," +
            " ' ', u.lastName, ' ', u.email) LIKE %?1%")
    Page<User> searchKeyword(String keyword, Pageable pageable);
}