package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public interface CustomerRepo extends SearchRepository<Customer, Integer> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByVerificationCode(String code);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.enabled=?2 WHERE c.id=?1")
    void changeStatus(Integer id, boolean status);


    @Query("SELECT c FROM Customer c WHERE CONCAT(c.firstName,' ', c.lastName,' ', " +
            "c.email, ' ',c.mainAddress,' ',c.extraAddress, ' ', c.state,' ',c.postalCode," +
            "' ',c.city,' ',c.country.name) LIKE %?1%")
    Page<Customer> searchKeyword(String keyword, Pageable pageable);


    @Query("SELECT c FROM Customer c")
    Page<Customer> find(String keyword, Integer id, String catId, Pageable pageable);
}
