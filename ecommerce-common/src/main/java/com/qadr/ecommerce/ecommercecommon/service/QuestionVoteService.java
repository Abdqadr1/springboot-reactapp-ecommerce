package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.VoteResult;
import com.qadr.ecommerce.ecommercecommon.model.VoteType;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.question.QuestionVote;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionRepo;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionVoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionVoteService {
    @Autowired private QuestionVoteRepo repo;
    @Autowired private QuestionRepo questionRepo;

    public VoteResult undoVote(QuestionVote vote, Integer questionId, VoteType voteType){
        repo.delete(vote);
        questionRepo.updateVote(questionId);
        int voteCount = questionRepo.getVoteCount(questionId);
        return VoteResult.success("You have unvoted " + voteType.toString() + " this question", voteCount);
    }

    public VoteResult doVote(Integer questionId, Customer customer, VoteType voteType){
        Question question = questionRepo
                .findById(questionId)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "The Question ID " + questionId + " no longer exists"));
        final VoteResult[] voteResult = new VoteResult[1];
        repo.findByQuestionAndCustomer(question, customer)
                .map(vote -> {
                    if (vote.isUpvoted() && voteType.equals(VoteType.UP) ||
                            vote.isDownvoted() && voteType.equals(VoteType.DOWN)) {
                        voteResult[0] = undoVote(vote, questionId, voteType);
                    } else if (vote.isUpvoted() && voteType.equals(VoteType.DOWN)) {
                        vote.voteDown();
                        voteResult[0] = vote(vote, questionId);
                    } else if (vote.isDownvoted() && voteType.equals(VoteType.UP)) {
                        vote.voteUP();
                        voteResult[0] = vote(vote, questionId);
                    }
                    return vote;
                })
                .orElseGet(() -> {
                    QuestionVote vote = new QuestionVote();
                    vote.setCustomer(customer);
                    vote.setQuestion(new Question(questionId));
                    if (voteType.equals(VoteType.UP)) vote.voteUP();
                    else vote.voteDown();
                    voteResult[0] = vote(vote, questionId);
                    return vote;
                });
        return voteResult[0];
    }

    public VoteResult vote(QuestionVote vote, Integer questionId){
        repo.save(vote);
        questionRepo.updateVote(questionId);
        int voteCount = questionRepo.getVoteCount(questionId);
        return VoteResult.success("Vote saved", voteCount);
    }
}
