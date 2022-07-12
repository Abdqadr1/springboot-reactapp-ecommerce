package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.ecommercecommon.service.ProductService;
import com.qadr.ecommerce.ecommercecommon.service.QuestionService;
import com.qadr.ecommerce.ecommercecommon.service.ReviewService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.qadr.ecommerce.ecommercecommon.service.ProductService.PRODUCTS_PER_PAGE;
import static com.qadr.ecommerce.ecommercecommon.service.ProductService.SEARCH_PRODUCTS_PER_PAGE;


@RestController
@RequestMapping("/p")
public class ProductController {
    @Autowired private ProductService productService;
    @Autowired private ReviewService reviewService;
    @Autowired private QuestionService questionService;
    @Autowired private CustomerService customerService;
    @Autowired private ControllerHelper controllerHelper;

    @GetMapping("/cat")
    public Map<String, Object> getCategoryProducts(
            @RequestParam("page-number") int pageNumber,
            @RequestParam("cat") int catId){

        Page<Product> page = productService.getCategoryProducts(pageNumber, catId);
        int startCount = (pageNumber-1) * PRODUCTS_PER_PAGE + 1;
        int endCount = PRODUCTS_PER_PAGE * pageNumber;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;
        Map<String, Object> res = new HashMap<>();
        res.put("currentPage", pageNumber);
        res.put("startCount", startCount);
        res.put("endCount", endCount);
        res.put("totalPages", page.getTotalPages());
        res.put("totalElements", page.getTotalElements());
        res.put("products", page.getContent());
        res.put("numberPerPage", PRODUCTS_PER_PAGE);

        return res;
    }

    @GetMapping("/alias/{alias}")
    Map<String, Object> getProductByAlias(@PathVariable("alias") String alias,
                              @PagingAndSortingParam("reviews")PagingAndSortingHelper helper){
        Product product = productService.getByAlias(alias);
        Map<String, Object> map = new HashMap<>();
        map.put("product", product);
        map.put("reviews", getProductReviews(1, product, helper).get("reviews"));
        map.put("questions", getProductQuestions(1, product.getId(), helper).get("questions"));
        return map;
    }

    @GetMapping("/{id}/questions/{number}")
    public Map<String, Object> listProductQuestionsByPage(@PathVariable("id") Integer id,
                                                          @PathVariable("number") Integer number,
                                                          @PagingAndSortingParam("questions") PagingAndSortingHelper helper){

        Product product = productService.getById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("product", product);
        map.putAll(getProductQuestions(number, id, helper));
        return map;
    }

    @GetMapping("/{id}/reviews/{number}")
    public Map<String, Object> getProductReviews(@PathVariable("number") Integer number,
                                                 @PathVariable("id") Integer id,
                                                 @PagingAndSortingParam("reviews")PagingAndSortingHelper helper){
        Product product = productService.getById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("product", product);
        map.putAll(getProductReviews(number, product, helper));
        return map;
    }

    public Map<String, Object> getProductReviews(Integer number, Product product, PagingAndSortingHelper helper){
        if(controllerHelper.isLoggedIn()){
            Customer customer = controllerHelper.getCustomerDetails();
            product.setCustomerCanReview
                    (reviewService.canCustomerReviewProduct(product.getId(), customer.getId()));
            product.setReviewedByCustomer
                    (reviewService.didCustomerReviewProduct(product.getId(), customer.getId()));

            return reviewService.getProductReviews(number, customer,  product, helper);
        }else{
            return reviewService.getProductReviews(number, product, helper);
        }
    }

    public Map<String, Object> getProductQuestions(Integer number, Integer id, PagingAndSortingHelper helper){
        helper.setName("questions");
        if(controllerHelper.isLoggedIn()){
            Customer customer = controllerHelper.getCustomerDetails();
            return questionService.getProductQuestionsPage(number, customer, id, helper);
        }else{
            return questionService.getProductQuestionsPage(number, id, helper);
        }
    }


    @GetMapping("/search/{keyword}")
    public Map<String, Object> getProductByAlias(@PathVariable("keyword") String keyword,
                              @RequestParam(value = "page-number", defaultValue = "1") Integer pageNumber){
        Page<Product> page = productService.searchKeyword(pageNumber, keyword);
        int startCount = (pageNumber-1) * SEARCH_PRODUCTS_PER_PAGE + 1;
        int endCount = PRODUCTS_PER_PAGE * pageNumber;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;
        Map<String, Object> res = new HashMap<>();
        res.put("currentPage", pageNumber);
        res.put("startCount", startCount);
        res.put("endCount", endCount);
        res.put("totalPages", page.getTotalPages());
        res.put("totalElements", page.getTotalElements());
        res.put("products", page.getContent());
        res.put("numberPerPage", SEARCH_PRODUCTS_PER_PAGE);

        return res;
    }

}

