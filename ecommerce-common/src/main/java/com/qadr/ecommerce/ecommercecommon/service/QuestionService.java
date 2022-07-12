package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.question.QuestionVote;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.entities.review.ReviewVote;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionRepo;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionVoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class QuestionService {
    public static final int QUESTIONS_PER_PAGE = 5;
    @Autowired private QuestionRepo repo;
    @Autowired private QuestionVoteRepo questionVoteRepo;
    @Autowired private ProductRepo productRepo;

    public Map<String, Object> getPage(int pageNumber, Customer customer,
                                       @PagingAndSortingParam("questions") PagingAndSortingHelper helper){
        return helper.getCustomerQuestions(pageNumber, customer, QUESTIONS_PER_PAGE, repo);
    }

    public Map<String, Object> getProductQuestionsPage(Integer number, Customer customer, Integer productID,
                                                       PagingAndSortingHelper helper) {
        Map<String, Object> objectMap =
                helper.getProductQuestions(number, productID, QUESTIONS_PER_PAGE, repo);
        List<Question> questions = (List<Question>) objectMap.get("questions");
        markQuestionsVoteForProductByCustomer(questions, customer);
        return objectMap;
    }
    public Map<String, Object> getProductQuestionsPage(Integer number, Integer productID,
                                                       PagingAndSortingHelper helper) {
        return helper.getProductQuestions(number, productID, QUESTIONS_PER_PAGE, repo);
    }

    public List<Question> getAll() {
        return repo.findAll(Sort.by("askTime").ascending());
    }

    public Question getByCustomerAndId(Integer id, Customer customer) {
        return repo.findByIdAndAsker(id, customer)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find question"));
    }
    public void saveQuestion(Question question){
        productRepo.findById(question.getProduct().getId())
                .orElseThrow(()->new CustomException(HttpStatus.BAD_REQUEST, "Could not find product"));
        question.setAskTime(new Date());
        Question save = repo.save(question);
        productRepo.updateProductQuestionCount(save.getProduct().getId());
    }

    public void markQuestionsVoteForProductByCustomer(List<Question> questions, Customer customer){
        questions.forEach(question -> {
            Optional<QuestionVote> optional = questionVoteRepo.findByQuestionAndCustomer(question, customer);
            if (optional.isPresent()){
                question.setCustomerVote(optional.get().getVotes());
            } else{
                question.setCustomerVote(0);
            }
        });
    }

}
