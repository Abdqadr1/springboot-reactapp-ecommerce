package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.Rollback;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class QuestionRepoTest {
    @Autowired private QuestionRepo repo;

    @Test
    void testAddQuestion(){
        Question question = new Question();
        question.setQuestionContent("Where is this product made?");
        question.setAsker(new Customer(2));
        question.setAskTime(new Date());
        question.setProduct(new Product(43));
        Question save = repo.save(question);
        assertThat(save).isNotNull();
    }
    @Test
    void testFindQuestion(){
        int id = 1;
        Optional<Question> byId = repo.findById(id);
        assertThat(byId).isPresent();
        System.out.println(byId.get());
    }
    @Test
    void searchByCustomer() {
        int customerId = 7;
        String keyword = "bosch";
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Question> byAsker = repo.searchByCustomer(keyword, customerId, pageRequest);
        assertThat(byAsker.getContent().size()).isGreaterThan(0);
        System.out.println(byAsker.getContent());
    }

    @Test
    void findByAsker() {
        Customer customer = new Customer(4);
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Question> byAsker = repo.findByAsker(customer, pageRequest);
        assertThat(byAsker.getContent().size()).isGreaterThan(0);
        System.out.println(byAsker.getContent());
    }

    @Test
    void findByIdAndAsker() {
        int id = 2;
        Optional<Question> optional = repo.findByIdAndAsker(id, new Customer(7));
        assertThat(optional).isPresent();
        System.out.println(optional.get());
    }

    @Test
    void searchKeyword() {
        String keyword = "";
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Question> byAsker = repo.searchKeyword(keyword, pageRequest);
        assertThat(byAsker.getContent().size()).isGreaterThan(0);
        System.out.println(byAsker.getContent());
    }

    @Test
    void findAllByProduct() {
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Question> allByProduct = repo.findAllByProduct(43, pageRequest);
        assertThat(allByProduct.getContent().size()).isGreaterThan(0);
        System.out.println(allByProduct.getContent());
    }

    @Test
    void countByAskerAndProduct() {
        int customerId = 4, productId = 45;
        Long aLong = repo.countByAskerAndProduct(customerId, productId);
        assertEquals(1, aLong);
    }


    @Test
    void updateVote() {
        int id = 2;
        repo.updateVote(2);
    }

    @Test
    void getVoteCount() {
        int id = 2;
        int voteCount = repo.getVoteCount(id);
        assertEquals(2, voteCount);
    }
}