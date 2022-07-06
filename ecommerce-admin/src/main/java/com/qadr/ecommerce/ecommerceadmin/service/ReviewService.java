package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {
    public static final int REVIEWS_PER_PAGE = 5;
    @Autowired private ReviewRepository repo;
    @Autowired private ProductRepo productRepo;

    private Review get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find Review"));
    }

    public Review saveReview(Review review){
        Review reviewInDb = get(review.getId());
        reviewInDb.setComment(review.getComment());
        reviewInDb.setHeadline(review.getHeadline());
        productRepo.updateProductRating(reviewInDb.getProduct().getId());
        return repo.save(reviewInDb);
    }

    public void deleteReview(Integer id){
        get(id);
        repo.deleteById(id);
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, REVIEWS_PER_PAGE, repo);
    }

    public List<Review> getAll() {
        return repo.findAll(Sort.by("reviewTime").ascending());
    }

}
