package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.Review;
import com.qadr.ecommerce.sharedLibrary.entities.order.OrderStatus;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.OrderDetailsRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ReviewRepository;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
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
public class ReviewService {
    public static final int REVIEWS_PER_PAGE = 5;
    public static final int PRODUCTS_REVIEWS_PER_PAGE = 5;
    @Autowired private ReviewRepository repo;
    @Autowired private OrderDetailsRepo orderDetailsRepo;
    @Autowired private ProductRepo productRepo;

    public Map<String, Object> getPage(int pageNumber, Customer customer,
                                       @PagingAndSortingParam("reviews") PagingAndSortingHelper helper){
        return helper.getCustomerReviews(pageNumber, customer, REVIEWS_PER_PAGE, repo);
    }

    public List<Review> getAll() {
        return repo.findAll(Sort.by("reviewTime").ascending());
    }

    public Review getByCustomerAndId(Integer id, Customer customer) {
        return repo.findByIdAndCustomer(id, customer)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find review"));
    }

    public void saveReview(Review review){
        productRepo.findById(review.getProduct().getId())
                .orElseThrow(()->new CustomException(HttpStatus.BAD_REQUEST, "Could not find product"));
        if(!canCustomerReviewProduct(review.getProduct().getId(),review.getCustomer().getId())){
            throw new CustomException(
                    HttpStatus.BAD_REQUEST,
                    "You can't review this product because you didn't purchase it, or it hasn't been delivered"
            );
        }
        if(didCustomerReviewProduct(review.getProduct().getId(), review.getCustomer().getId())){
            throw new CustomException(
                    HttpStatus.BAD_REQUEST,
                    "You have already posted review on this product"
            );
        }
        review.setReviewTime(new Date());
        Review save = repo.save(review);
        productRepo.updateProductRating(save.getProduct().getId());
    }

    public Map<String, Object> getProductReviews(int pageNumber, Product product,
                                       @PagingAndSortingParam("reviews") PagingAndSortingHelper helper){
        return helper.getProductReviews(pageNumber, product, PRODUCTS_REVIEWS_PER_PAGE, repo);
    }

    public boolean didCustomerReviewProduct(Integer productId, Integer customerId){
        return repo.countByCustomerAndProduct(customerId, productId) > 0;
    }
    public boolean canCustomerReviewProduct(Integer productId, Integer customerId){
      return orderDetailsRepo
                .countByProductAndCustomerAndStatus(productId, customerId, OrderStatus.DELIVERED) > 0;
    }
}
