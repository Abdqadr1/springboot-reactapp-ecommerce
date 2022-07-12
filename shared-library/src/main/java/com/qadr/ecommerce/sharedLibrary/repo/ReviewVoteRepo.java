package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.entities.review.ReviewVote;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewVoteRepo extends PagingAndSortingRepository<ReviewVote, Integer> {

    Optional<ReviewVote> findByReviewAndCustomer(Review review, Customer customer);

    @Query("SELECT r FROM ReviewVote r WHERE r.customer.id = ?2 AND r.review.product.id=?1")
    Optional<ReviewVote> findByProductAndCustomer(Integer productId, Integer customerId);

    @Modifying
    @Query("DELETE FROM ReviewVote r WHERE r.review.id = ?1")
    void deleteByReview(Integer id);
}
