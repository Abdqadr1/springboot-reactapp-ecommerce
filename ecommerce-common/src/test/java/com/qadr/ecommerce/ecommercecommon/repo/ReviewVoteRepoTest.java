package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.entities.review.ReviewVote;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewVoteRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class ReviewVoteRepoTest {

    @Autowired
    private ReviewVoteRepo repo;

    @Test
    void testAddReviewVote(){
        ReviewVote reviewVote = new ReviewVote();
        reviewVote.setReview(new Review(4));
        reviewVote.setCustomer(new Customer(11));
        reviewVote.setVotes(0);
        ReviewVote save = repo.save(reviewVote);
        assertThat(save).isNotNull();
        System.out.println(save);
    }

    @Test
    void findByReviewAndCustomer() {
        Customer customer = new Customer(7);
        Review review = new Review(4);
        Optional<ReviewVote> reviewAndCustomer = repo.findByReviewAndCustomer(review, customer);
        assertThat(reviewAndCustomer).isPresent();
        System.out.println(reviewAndCustomer.get());
    }

    @Test
    void findByProductAndCustomer() {
        int customerId = 7;
        int productId = 1;
        Optional<ReviewVote> byProductAndCustomer = repo.findByProductAndCustomer(productId, customerId);
        assertThat(byProductAndCustomer).isPresent();
        System.out.println(byProductAndCustomer.get());
    }
}