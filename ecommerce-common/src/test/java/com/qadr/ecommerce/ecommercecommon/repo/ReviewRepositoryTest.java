package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class ReviewRepositoryTest {
    @Autowired
    private ReviewRepository repo;

    @Test
    void searchByCustomer() {
        Sort sort = Sort.by("reviewTime").descending();
        PageRequest pageable = PageRequest.of(0, 5, sort);
        Customer customer = new Customer(7);
        String keyword = "a";
        Page<Review> reviewPage = repo.searchByCustomer(keyword, customer.getId(), pageable);
        List<Review> content = reviewPage.getContent();
        assertThat(content.size()).isGreaterThan(0);
        System.out.println(content);
    }

    @Test
    void findByCustomer() {
        Sort sort = Sort.by("reviewTime").descending();
        PageRequest pageable = PageRequest.of(0, 5, sort);
        Customer customer = new Customer(7);
        Page<Review> reviewPage = repo.findByCustomer(customer, pageable);
        List<Review> content = reviewPage.getContent();
        assertThat(content.size()).isGreaterThan(0);
        System.out.println(content);
    }

    @Test
    void findByCustomerAndId() {
        int id = 5;
        Customer customer = new Customer(7);
        Optional<Review> reviewPage = repo.findByIdAndCustomer(id, customer);
        assertThat(reviewPage).isPresent();
        System.out.println(reviewPage.get());
    }

    @Test
    void testFindByProduct(){
        Product product = new Product(12);
        Sort sort = Sort.by("reviewTime").descending();
        PageRequest pageable = PageRequest.of(0, 5, sort);
        Page<Review> allByProduct = repo.findAllByProduct(product, pageable);
        assertThat(allByProduct.getContent().size()).isGreaterThan(0);
        System.out.println(allByProduct.getContent());
    }
}