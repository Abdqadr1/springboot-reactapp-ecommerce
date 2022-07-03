package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends SearchRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE CONCAT(r.product.name,' ', r.customer.lastName,' ', " +
            "r.customer.firstName, ' ',r.rating) LIKE %?1%")
    Page<Review> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT r FROM Review r")
    Page<Review> find(String keyword, Integer id, String catId, Pageable pageable);
}
