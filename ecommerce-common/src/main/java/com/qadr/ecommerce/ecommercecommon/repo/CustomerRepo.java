package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByVerificationCode(String code);

    @Modifying
    @Query("UPDATE Customer c SET c.enabled=?2 WHERE c.id=?1")
    void changeStatus(Integer id, boolean status);



}
