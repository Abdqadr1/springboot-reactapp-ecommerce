package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.repo.ProductRepository;
import com.qadr.ecommerce.sharedLibrary.entities.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public static final int PRODUCTS_PER_PAGE = 10;

    public Page<Product> getCategoryProducts(int pageNumber, int categoryId){
        Pageable pageable = PageRequest.of(pageNumber-1, PRODUCTS_PER_PAGE);
        String ids = "-"+categoryId+"-";
        return productRepository.getCategoryProducts(categoryId, ids, pageable);
    }
}
