package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.repo.CategoryRepository;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getCategories(){
        return categoryRepository.findAllEnabled().stream()
                .filter(category -> category.getChildren().size() == 0)
                .collect(Collectors.toList());
    }

    public Category getCategory(String alias) {
        return categoryRepository.findByAlias(alias)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST,"No category found with the alias "+alias));
    }
}
