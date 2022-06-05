package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.export.CategoryCsvExport;
import com.qadr.ecommerce.ecommerceadmin.service.CategoryService;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.util.FileUploadUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public CustomCategoryPage listFirstPage(){
        return listByPage(1, "name", "asc", null);
    }

    @GetMapping("/page/{number}")
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

    @GetMapping("/{id}/enable/{status}")
    public String updateEnabled(@PathVariable("id") Integer id,
                                @PathVariable("status") boolean status){
        return categoryService.updateStatus(id, status);
    }

    @GetMapping("/get-hierarchy")
    public List<Category> getHierarchy(){
        return categoryService.getHierarchy();
    }

    @PostMapping("/add")
    public Category addCategory(Category category,
                                @RequestParam(value = "image", required = false)MultipartFile file) throws IOException {
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            category.setPhoto(filename);
            Category savedCategory = categoryService.addCategory(category);
            String uploadFolder = "category-photos/"+savedCategory.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return savedCategory;
        }
        return categoryService.addCategory(category);
    }

    @PostMapping("/edit/{id}")
    public Category editCategory(Category category,
                                @PathVariable("id") Integer id,
                                @RequestParam(value = "image", required = false)MultipartFile file) throws IOException {
        System.out.println(category);
        if(Optional.ofNullable(file).isPresent()){
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            filename = filename.length() > 255 ? filename.substring(0, 254) : filename;
            category.setPhoto(filename);
            Category savedCategory = categoryService.editCategory(id, category);
            String uploadFolder = "category-photos/"+savedCategory.getId();
            FileUploadUtil.saveFile(file, uploadFolder, filename);
            return savedCategory;
        }
        return categoryService.editCategory(id, category);
    }

    @GetMapping("/delete/{id}")
    public Category deleteCategory(@PathVariable("id") Integer id){
        return categoryService.deleteCategory(id);
    }

    @GetMapping("/export/csv")
    void exportCSV(HttpServletResponse response) throws IOException {
        List<Category> categories = categoryService.getAll();
        CategoryCsvExport categoryCsvExport = new CategoryCsvExport();
        categoryCsvExport.export(categories, response);
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