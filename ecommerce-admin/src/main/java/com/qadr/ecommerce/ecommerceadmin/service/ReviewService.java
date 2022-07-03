package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {
    public static final int REVIEWS_PER_PAGE = 5;
    @Autowired private ReviewRepository repo;


    public Review saveReview(Review review){
        return repo.save(review);
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, REVIEWS_PER_PAGE, repo);
    }

    public List<Review> getAll() {
        return repo.findAll(Sort.by("rating").ascending());
    }

}
