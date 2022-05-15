package com.qadr.ecommerceadmin.controllers;

import com.qadr.ecommerceadmin.model.Category;
import com.qadr.ecommerceadmin.service.CategoryService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/category")
    public CustomCategoryPage listFirstPage(){
        return listByPage(1, "name", "asc", null);
    }

    @GetMapping("/category/page/{number}")
    public CustomCategoryPage listByPage(@PathVariable("number") Integer number,
                                         @RequestParam("sortField") String sortField,
                                         @RequestParam("dir") String dir,
                                         @RequestParam(value = "keyword", required = false) String keyword){

        Page<Category> page = categoryService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * CategoryService.CATEGORY_PER_PAGE + 1;
        int endCount = CategoryService.CATEGORY_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;


        return new CustomCategoryPage(
                number, startCount, endCount, page.getTotalPages(),
                page.getTotalElements(), page.getContent(), CategoryService.CATEGORY_PER_PAGE
        );
    }


}

@AllArgsConstructor
@Data
class CustomCategoryPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<Category> categories;
    Integer numberPerPage;
}