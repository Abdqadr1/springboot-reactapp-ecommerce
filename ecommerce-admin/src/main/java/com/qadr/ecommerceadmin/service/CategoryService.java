package com.qadr.ecommerceadmin.service;

import com.qadr.ecommerceadmin.model.Category;
import com.qadr.ecommerceadmin.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepo categoryRepo;

    public static final int CATEGORY_PER_PAGE = 4;


    public List<Category> getAll(){
        return categoryRepo.findAll(Sort.by("name").ascending());
    }

    public Page<Category> getPage(int pageNumber, String field, String dir, String keyword){
        Sort sort = Sort.by(field);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(pageNumber - 1, CATEGORY_PER_PAGE, sort);

        if(keyword != null && !keyword.isBlank()){
            return categoryRepo.searchKeyword(keyword, pageable);
        }

        return categoryRepo.findAll(pageable);
    }

}
