package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
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

@Service
@Transactional
public class QuestionService {
    public static final int QUESTIONS_PER_PAGE = 5;
    @Autowired private QuestionRepo repo;
    @Autowired private QuestionVoteRepo questionVoteRepo;
    @Autowired private ProductRepo productRepo;

    private Question get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find question with id "+ id));
    }

    public Question saveQuestion(Question question, User user){
        Question questionInDb = get(question.getId());
        if(!question.getAnswerContent().isBlank() && !question.getAnswerContent().trim().equals("")){
            questionInDb.setAnswerContent(question.getAnswerContent());
            questionInDb.setAnswerer(user);
            questionInDb.setAnswerTime(new Date());
        }
        questionInDb.setQuestionContent(question.getQuestionContent());
        questionInDb.setApprovalStatus(question.isApprovalStatus());
        productRepo.updateProductQuestionCount(questionInDb.getProduct().getId());
        return repo.save(questionInDb);
    }

    public void changeApprovalStatus(Integer id, boolean status){
        Question question = get(id);
        question.setApprovalStatus(status);
        repo.save(question);
    }

    public void deleteQuestion(Integer id){
        get(id);
        repo.deleteById(id);
        questionVoteRepo.deleteByQuestion(id);
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, QUESTIONS_PER_PAGE, repo);
    }

    public List<Question> getAll() {
        return repo.findAll(Sort.by("askTime").ascending());
    }

}
