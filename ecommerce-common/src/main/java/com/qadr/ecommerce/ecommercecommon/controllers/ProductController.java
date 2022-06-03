package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.ProductService;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.qadr.ecommerce.ecommercecommon.service.ProductService.PRODUCTS_PER_PAGE;


@RestController
@RequestMapping("/p")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    String getProducts(){
        return "Getting it";
    }
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
}
@AllArgsConstructor
@Data
class CustomProductPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<Product> products;
    Integer numberPerPage;
}
