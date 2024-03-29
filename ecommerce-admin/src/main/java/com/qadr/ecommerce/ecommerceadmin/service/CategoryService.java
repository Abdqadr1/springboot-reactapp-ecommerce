package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.ecommerceadmin.repo.CategoryRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.util.AmazonS3Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.qadr.ecommerce.sharedLibrary.entities.Constants.CATEGORY_IMAGE_FOLDER_NAME;

@Service
@Transactional
public class CategoryService {
    @Autowired
    private CategoryRepo categoryRepo;

    public static final int CATEGORY_PER_PAGE = 10;


    public List<Category> getAll(){
        return categoryRepo.findAll(Sort.by("name").ascending());
    }

    public Map<String, Object> getPage(int pageNumber, PagingAndSortingHelper helper){
        return helper.getPageInfo(pageNumber, CATEGORY_PER_PAGE, categoryRepo);
    }

    public String updateStatus(Integer id, boolean status) {
        categoryRepo.findById(id).
                orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Category not found"));

        categoryRepo.updateStatus(id, status);

        return "Category status updated";
    }

    public List<Category> getHierarchy() {
        final List<Category> hierarchies = new ArrayList<>();
        categoryRepo.findAll().stream()
                .filter(category -> category.getParent() == null)
                .forEach(category -> {
                    hierarchies.add(new Category(category.getId(), category.getName()));
                    if(!category.getChildren().isEmpty()) addSubCategories(category.getChildren(), 1, hierarchies);
                });
        return hierarchies;
    }

    public Category addCategory(Category category) {
        Optional<Category> byName = categoryRepo.findByName(category.getName());
        if(byName.isPresent()) throw new CustomException(HttpStatus.BAD_REQUEST, "Name already exists");
        Optional<Category> byAlias = categoryRepo.findByAlias(category.getAlias());
        if(byAlias.isPresent()) throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");

        getAllParentIds(category);

        return categoryRepo.save(category);
    }

    public Category deleteCategory(Integer id){
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Category not found"));

        if(!category.getChildren().isEmpty()){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid action, Category has children");
        }

        categoryRepo.deleteById(id);
        AmazonS3Util.removeFolder(CATEGORY_IMAGE_FOLDER_NAME + "/" + id);
        return category;
    }



    void addSubCategories(Collection<Category> children, Integer dashes, List<Category> hierarchies){
        StringBuilder prefix = new StringBuilder();
        prefix.append("-".repeat(Math.max(0, dashes)));
        children.forEach(category -> {
            String name = prefix+category.getName();
            hierarchies.add(new Category(category.getId(), name));
            if(!category.getChildren().isEmpty()) addSubCategories(category.getChildren(), dashes+1, hierarchies);
        });
    }

    void getAllParentIds(Category category){
        if(category.getParent() != null ){
            Category parent = category.getParent();
            String parentIds = (parent.getAllParentIds() == null) ? "-" : parent.getAllParentIds();
            parentIds += parent.getId() + "-";
            category.setAllParentIds(parentIds);
        }
    }


    public Category editCategory(Integer id, Category category) {
        Category byId = categoryRepo.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Category not found"));
        Optional<Category> byName = categoryRepo.findByName(category.getName());
        if(byName.isPresent() && !Objects.equals(byName.get().getId(), id))
            throw new CustomException(HttpStatus.BAD_REQUEST, "Name already exists");
        Optional<Category> byAlias = categoryRepo.findByAlias(category.getAlias());
        if(byAlias.isPresent() && !Objects.equals(byAlias.get().getId(), id))
            throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");
        if(category.getPhoto() == null) category.setPhoto(byId.getPhoto());
        getAllParentIds(category);

        return categoryRepo.save(category);
    }
}
