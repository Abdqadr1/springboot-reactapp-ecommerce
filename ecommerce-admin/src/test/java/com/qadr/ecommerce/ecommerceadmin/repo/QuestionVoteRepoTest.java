package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.question.QuestionVote;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionVoteRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class QuestionVoteRepoTest {
    @Autowired private QuestionVoteRepo repo;
    @Test
    void testAddVoted(){
        QuestionVote questionVote = new QuestionVote();
        questionVote.setQuestion(new Question(2));
        questionVote.setCustomer(new Customer(6));
        questionVote.voteUP();
        QuestionVote save = repo.save(questionVote);
        assertThat(save).isNotNull();
        System.out.println(save);
    }

    @Test
    void findByQuestionAndCustomer() {
        Question question = new Question(2);
        Customer customer = new Customer(6);
        Optional<QuestionVote> optional = repo.findByQuestionAndCustomer(question, customer);
        assertThat(optional).isPresent();
        System.out.println(optional.get());
    }

    @Test
    void findByProductAndCustomer() {
        int productId = 23;
        int customerId = 6;
        Optional<QuestionVote> optional = repo.findByProductAndCustomer(productId, customerId);
        assertThat(optional).isPresent();
        System.out.println(optional.get());
    }

    @Test
    void testDeleteByQuestion(){
        int questionID = 2;
        repo.deleteByQuestion(questionID);
    }
}