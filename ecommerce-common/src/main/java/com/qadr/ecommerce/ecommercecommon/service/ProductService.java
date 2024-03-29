package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ProductService {
    @Autowired private ProductRepo productRepository;
    public static final int PRODUCTS_PER_PAGE = 10;
    public static final int SEARCH_PRODUCTS_PER_PAGE = 10;

    public Page<Product> getCategoryProducts(int pageNumber, int categoryId){
        Pageable pageable = PageRequest.of(pageNumber-1, PRODUCTS_PER_PAGE);
        String ids = "-"+categoryId+"-";
        return productRepository.getCategoryProducts(categoryId, ids, pageable);
    }

    public Page<Product> getBrandProducts(int pageNumber, int brandId) {
        Pageable pageable = PageRequest.of(pageNumber-1, PRODUCTS_PER_PAGE);
        return productRepository.getBrandProducts(brandId, pageable);
    }

    public Page<Product> searchKeyword(int pageNumber, String keyword){
        Pageable pageable = PageRequest.of(pageNumber -1, SEARCH_PRODUCTS_PER_PAGE);
        return productRepository.searchKeyword(keyword, pageable);
    }

    public Product getByAlias(String alias) {
        return productRepository.findByAlias(alias)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Product not found with alias " + alias));
    }
    public Product getById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Product not found with id " + id));
    }

}
