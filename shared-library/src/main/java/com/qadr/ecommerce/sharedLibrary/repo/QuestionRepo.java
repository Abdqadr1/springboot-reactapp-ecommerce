package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionRepo  extends SearchRepository<Question, Integer> {
    @Query("SELECT r FROM Question r WHERE r.asker.id = ?2 AND CONCAT(r.product.name, ' '," +
            "r.questionContent, ' ',r.answerContent) LIKE %?1%")
    Page<Question> searchByCustomer(String keyword, Integer id, Pageable pageable);

    Page<Question> findByAsker(Customer customer, Pageable pageable);

    Optional<Question> findByIdAndAsker(Integer id, Customer asker);


    @Query("SELECT r FROM Question r WHERE CONCAT(r.product.name,' ', r.asker.lastName,' ', " +
            "r.asker.firstName, ' ',r.questionContent, ' ', r.answerContent) LIKE %?1%")
    Page<Question> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT r FROM Question r")
    Page<Question> find(String keyword, Integer id, String catId, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.approvalStatus = true AND q.product.id = ?1")
    Page<Question> findAllByProduct(Integer productId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Question r WHERE r.asker.id =?1 AND r.product.id = ?2")
    Long countByAskerAndProduct(Integer customer, Integer product);

    @Query("SELECT COUNT(r) FROM Question r WHERE r.answerer.id =?1 AND r.product.id = ?2")
    Long countByAnswererAndProduct(Integer customer, Integer product);

    @Modifying
    @Query("UPDATE Question r SET r.votes=COALESCE ((SELECT SUM(v.votes) FROM QuestionVote v WHERE v.question.id = ?1), 0) WHERE r.id=?1")
    void updateVote(Integer questionId);

    @Query("SELECT r.votes FROM Question r WHERE r.id =?1")
    int getVoteCount(Integer questionId);
}
