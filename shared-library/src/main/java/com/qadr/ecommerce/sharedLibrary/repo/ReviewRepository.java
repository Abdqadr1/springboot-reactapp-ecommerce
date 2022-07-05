package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends SearchRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.customer.id = ?2 AND CONCAT(r.product.name, " +
            "r.headline, ' ',r.comment) LIKE %?1%")
    Page<Review> searchByCustomer(String keyword, Integer id,  Pageable pageable);

    Page<Review> findByCustomer(Customer customer, Pageable pageable);

    Optional<Review> findByIdAndCustomer(Integer id, Customer customer);


    @Query("SELECT r FROM Review r WHERE CONCAT(r.product.name,' ', r.customer.lastName,' ', " +
            "r.customer.firstName, ' ',r.rating) LIKE %?1%")
    Page<Review> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT r FROM Review r")
    Page<Review> find(String keyword, Integer id, String catId, Pageable pageable);

    Page<Review> findAllByProduct(Product product, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.customer.id =?1 AND r.product.id = ?2")
    Long countByCustomerAndProduct(Integer customer, Integer product);
}
