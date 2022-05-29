package com.qadr.ecommerceadmin.service;

import com.qadr.ecommerceadmin.errors.CustomException;
import com.qadr.ecommerceadmin.model.Brand;
import com.qadr.ecommerceadmin.model.Product;
import com.qadr.ecommerceadmin.repo.BrandRepo;
import com.qadr.ecommerceadmin.repo.CategoryRepo;
import com.qadr.ecommerceadmin.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProductService {

    public static final int CATEGORY_PER_PAGE = 10;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private BrandRepo brandRepo;
    @Autowired
    private CategoryRepo categoryRepo;

    public List<Product> getAll(){
        return productRepo.findAll(Sort.by("name").ascending());
    }

    public Page<Product> getPage(int pageNumber, String field, String dir, String keyword){
        Sort sort = Sort.by(field);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNumber - 1, CATEGORY_PER_PAGE, sort);

        if(keyword != null && !keyword.isBlank()){
            return productRepo.searchKeyword(keyword, pageable);
        }

        return productRepo.findAll(pageable);
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
}
