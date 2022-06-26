package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.ecommerceadmin.repo.BrandRepo;
import com.qadr.ecommerce.ecommerceadmin.repo.CategoryRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProductService {

    public static final int PRODUCTS_PER_PAGE = 10;
    public static final int PRODUCTS_PER_SEARCH_PAGE = 5;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private BrandRepo brandRepo;
    @Autowired
    private CategoryRepo categoryRepo;

    public List<Product> getAll(){
        return productRepo.findAll(Sort.by("name").ascending());
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, PRODUCTS_PER_PAGE, productRepo);
    }
    
    public Product addProduct(Product product){
        if(product.getId() != null) throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid parameter (id)");
        if(product.getAlias() == null || product.getAlias().isBlank()){
            product.setAlias(product.getName().replaceAll(" ", "-"));
        }else {
            product.setAlias(product.getAlias().replaceAll(" ", "-"));
        }
        Optional<Product> byName = productRepo.findByName(product.getName());
        Optional<Product> byAlias = productRepo.findByAlias(product.getName());
        if (byName.isPresent())
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is a product with the name " + product.getName());

        if (byAlias.isPresent())
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is a product with the alias " + product.getAlias());

        product.setCreatedTime(new Date());
        product.setUpdatedTime(new Date());
        Product save = productRepo.save(product);
        brandRepo.findById(save.getBrand().getId()).ifPresent(save::setBrand);
        categoryRepo.findById(save.getCategory().getId()).ifPresent(save::setCategory);
        return save;
    }

    public String setStatus(int id, boolean status){
        productRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Product not found!"));
        productRepo.setEnabledStatus(id, status);
        return "Product status updated";
    }

    public Product deleteProduct(Integer id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Product not found!"));

        productRepo.deleteById(id);
        return product;
    }

    public Product editProduct(Integer id, Product product) {
        Product oldProduct = productRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Product not found"));

        if(product.getAlias() == null || product.getAlias().isBlank()){
            product.setAlias(product.getName().replaceAll(" ", "-"));
        }else {
            product.setAlias(product.getAlias().replaceAll(" ", "-"));
        }
        Optional<Product> byName = productRepo.findByName(product.getName());
        Optional<Product> byAlias = productRepo.findByAlias(product.getName());
        if (byName.isPresent() && !Objects.equals(byName.get().getId(), id))
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is another product with the name " + product.getName());

        if (byAlias.isPresent() && !Objects.equals(byAlias.get().getId(), id))
            throw new CustomException(HttpStatus.BAD_REQUEST, "There is another product with the alias " + product.getAlias());

        if(product.getMainImage() == null || product.getMainImage().isBlank()) product.setMainImage(oldProduct.getMainImage());

        product.setCreatedTime(oldProduct.getCreatedTime());
        product.setUpdatedTime(new Date());
        Product save = productRepo.save(product);
        brandRepo.findById(save.getBrand().getId()).ifPresent(save::setBrand);
        categoryRepo.findById(save.getCategory().getId()).ifPresent(save::setCategory);
        return save;
    }

    public Map<String, Object> searchProducts(int pageNumber, PagingAndSortingHelper helper){
        return helper.searchProduct(pageNumber, PRODUCTS_PER_SEARCH_PAGE, productRepo);
    }
}
