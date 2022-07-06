package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.ProductService;
import com.qadr.ecommerce.ecommercecommon.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.qadr.ecommerce.ecommercecommon.service.ProductService.PRODUCTS_PER_PAGE;
import static com.qadr.ecommerce.ecommercecommon.service.ProductService.SEARCH_PRODUCTS_PER_PAGE;


@RestController
@RequestMapping("/p")
public class ProductController {
    @Autowired private ProductService productService;
    @Autowired private ReviewService reviewService;
    @Autowired private CustomerService customerService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/cat")
    public CustomProductPage getCategoryProducts(
            @RequestParam("page-number") int pageNumber,
            @RequestParam("cat") int catId){

        Page<Product> page = productService.getCategoryProducts(pageNumber, catId);
        int startCount = (pageNumber-1) * PRODUCTS_PER_PAGE + 1;
        int endCount = PRODUCTS_PER_PAGE * pageNumber;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;

        return new CustomProductPage(
                pageNumber,startCount, endCount,page.getTotalPages(),
                page.getTotalElements(), page.getContent(), PRODUCTS_PER_PAGE
        );
    }

    @GetMapping("/alias/{alias}")
    Map<String, Object> getProductByAlias(@PathVariable("alias") String alias,
                              @PagingAndSortingParam("reviews")PagingAndSortingHelper helper){
        Product product = productService.getByAlias(alias);
        Map<String, Object> res = new HashMap<>();
        if(controllerHelper.isLoggedIn()){
            Customer customer = controllerHelper.getCustomerDetails();
            product.setCustomerCanReview
                    (reviewService.canCustomerReviewProduct(product.getId(), customer.getId()));
            product.setReviewedByCustomer
                    (reviewService.didCustomerReviewProduct(product.getId(), customer.getId()));

            res.put("reviews", reviewService.getProductReviews(1, customer,  product, helper));
        }else{
            res.put("reviews", reviewService.getProductReviews(1, product, helper));

        }
        res.put("product", product);
        return res;
    }
    @GetMapping("/{id}/reviews/{number}")
    public Map<String, Object> getProductReviews(@PathVariable("number") Integer number,
                                                 @PathVariable("id") Integer id,
                                                 @PagingAndSortingParam("reviews")PagingAndSortingHelper helper){
        Product product = new Product(id);
        if(controllerHelper.isLoggedIn()){
            Customer customer = controllerHelper.getCustomerDetails();
            return reviewService.getProductReviews(number, customer, product, helper);
        }
        return reviewService.getProductReviews(number, product,helper);
    }

    @GetMapping("/search/{keyword}")
    CustomProductPage getProductByAlias(@PathVariable("keyword") String keyword,
                              @RequestParam(value = "page-number", defaultValue = "1") Integer pageNumber){
        Page<Product> page = productService.searchKeyword(pageNumber, keyword);
        int startCount = (pageNumber-1) * SEARCH_PRODUCTS_PER_PAGE + 1;
        int endCount = PRODUCTS_PER_PAGE * pageNumber;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;

        return new CustomProductPage(
                pageNumber,startCount, endCount,page.getTotalPages(),
                page.getTotalElements(), page.getContent(), SEARCH_PRODUCTS_PER_PAGE
        );
    }



    @AllArgsConstructor
    @Data
    static class CustomProductPage {
        Integer currentPage;
        Integer startCount;
        Integer endCount;
        Integer totalPages;
        Long totalElements;
        List<Product> products;
        Integer numberPerPage;
    }
}

