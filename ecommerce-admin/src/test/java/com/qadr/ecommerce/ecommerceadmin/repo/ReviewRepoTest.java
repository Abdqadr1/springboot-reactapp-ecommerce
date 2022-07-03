package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class ReviewRepoTest {
    @Autowired private ReviewRepository repo;

    @Test
    void testAddReview(){
        Customer customer = new Customer(3);
        Product product = new Product(56);
        Review review = new Review();
        review.setCustomer(customer);
        review.setProduct(product);
        review.setReviewTime(new Date());
        review.setHeadline("Cool stuff");
        review.setComment("No complain..");
        Review save = repo.save(review);
        assertThat(save).isNotNull();
    }

    @Test
    void testListReview(){
        List<Review> all = repo.findAll();
        assertThat(all.size()).isGreaterThan(0);
        all.forEach(System.out::println);
    }
    @Test
    void testUpdateReview(){
        int id = 1;
        Optional<Review> byId = repo.findById(id);
        assertThat(byId).isPresent();
        Review review = byId.get();
        review.setRating(3);
        Review save = repo.save(review);
        assertThat(save.getRating()).isEqualTo(3);
    }

    @Test
    void testDelete(){
        int id = 1;
        Optional<Review> byId = repo.findById(id);
        assertThat(byId).isPresent();
        repo.delete(byId.get());
        byId = repo.findById(id);
        assertThat(byId).isNotPresent();
    }
}
