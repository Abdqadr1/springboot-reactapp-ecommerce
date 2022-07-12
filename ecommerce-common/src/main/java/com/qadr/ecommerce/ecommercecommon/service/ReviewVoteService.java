package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.VoteResult;
import com.qadr.ecommerce.ecommercecommon.model.VoteType;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.entities.review.ReviewVote;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewVoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewVoteService {
    @Autowired private ReviewVoteRepo repo;
    @Autowired private ReviewRepository reviewRepository;

    public VoteResult doVote(Integer reviewId,Customer customer, VoteType voteType){
        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "The Review ID " + reviewId + " no longer exists"));
        final VoteResult[] voteResult = new VoteResult[1];
        repo.findByReviewAndCustomer(review, customer)
                .map(vote -> {
                    if (vote.isUpvoted() && voteType.equals(VoteType.UP) ||
                            vote.isDownvoted() && voteType.equals(VoteType.DOWN)) {
                        voteResult[0] = undoVote(vote, reviewId, voteType);
                    } else if (vote.isUpvoted() && voteType.equals(VoteType.DOWN)) {
                        vote.voteDown();
                        voteResult[0] = vote(vote, reviewId);
                    } else if (vote.isDownvoted() && voteType.equals(VoteType.UP)) {
                        vote.voteUP();
                        voteResult[0] = vote(vote, reviewId);
                    }
                    return vote;
                })
                .orElseGet(() -> {
                    ReviewVote vote = new ReviewVote();
                    vote.setCustomer(customer);
                    vote.setReview(new Review(reviewId));
                    if (voteType.equals(VoteType.UP)) vote.voteUP();
                    else vote.voteDown();
                    voteResult[0] = vote(vote, reviewId);
                    return vote;
                });
        return voteResult[0];
    }

    public VoteResult undoVote(ReviewVote vote, Integer reviewId, VoteType voteType){
        repo.delete(vote);
        reviewRepository.updateVote(reviewId);
        int voteCount = reviewRepository.getVoteCount(reviewId);
        return VoteResult.success("You have unvoted " + voteType.toString() + " this review", voteCount);
    }
    public VoteResult vote(ReviewVote vote, Integer reviewId){
        repo.save(vote);
        reviewRepository.updateVote(reviewId);
        int voteCount = reviewRepository.getVoteCount(reviewId);
        return VoteResult.success("Vote saved", voteCount);
    }

}
