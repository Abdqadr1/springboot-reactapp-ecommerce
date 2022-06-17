package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.AuthType;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShippingRateRepo extends SearchRepository<ShippingRate, Integer>{

    @Modifying
    @Query("UPDATE ShippingRate sr SET sr.COD=?2 WHERE sr.id=?1")
    void changeSupported(Integer id, boolean status);


    @Query("SELECT sr FROM ShippingRate sr WHERE CONCAT(sr.state,' ', sr.country.name) LIKE %?1%")
    Page<ShippingRate> searchKeyword(String keyword, Pageable pageable);


    @Query("SELECT s FROM ShippingRate s")
    Page<ShippingRate> find(String keyword, Integer id, String catId, Pageable pageable);

    @Query("SELECT s FROM ShippingRate s WHERE s.country.id=?1 AND s.state=?2")
    Optional<ShippingRate> findByCountryAndState(Integer countryId, String state);

}
