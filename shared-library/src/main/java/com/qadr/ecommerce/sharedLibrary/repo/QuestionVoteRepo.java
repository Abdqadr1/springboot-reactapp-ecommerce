package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.question.QuestionVote;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionVoteRepo extends CrudRepository<QuestionVote, Integer> {
    Optional<QuestionVote> findByQuestionAndCustomer(Question question, Customer customer);

    @Query("SELECT r FROM QuestionVote r WHERE r.customer.id = ?2 AND r.question.product.id=?1")
    Optional<QuestionVote> findByProductAndCustomer(Integer productId, Integer customerId);

    @Modifying
    @Query("DELETE FROM QuestionVote q WHERE q.question.id=?1")
    void deleteByQuestion(Integer id);
}
