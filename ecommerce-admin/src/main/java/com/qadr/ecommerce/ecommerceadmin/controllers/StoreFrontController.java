package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.BrandService;
import com.qadr.ecommerce.ecommerceadmin.service.CategoryService;
import com.qadr.ecommerce.ecommerceadmin.service.StoreFrontService;
import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontModel;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/storefront")
public class StoreFrontController {
    @Autowired private StoreFrontService storeFrontService;
    @Autowired private CategoryService categoryService;
    @Autowired private BrandService brandService;

    @GetMapping("/categories")
    public List<Category> getAllCategories(){
        return categoryService.getAll();
    }

    @GetMapping("/brands")
    public List<Brand> getAllBrands(){
        return brandService.getAll();
    }

    @PostMapping("/move")
    public List<Storefront> moveMenu(@Valid @RequestBody StoreFrontService.MoveDTO moveDTO){
        return storeFrontService.movePosition(moveDTO.getId(), moveDTO.getMoveType());
    }

    @GetMapping("/delete/{id}")
    public void deleteStorefront(@PathVariable("id") Integer id){
        storeFrontService.deleteStorefront(id);
    }

    @GetMapping("/{id}/enable/{status}")
    public void updateEnabled(@PathVariable("id") Integer id,
                              @PathVariable("status") boolean status){
        storeFrontService.updateEnabled(id, status);
    }

    @GetMapping("/page")
    public List<Storefront> listByPage(){
        return storeFrontService.getAll();
    }

    @PostMapping("/new/{type}")
    public Storefront newStorefront(@PathVariable String type, Storefront storeFront, int[] selected){
        StorefrontType storeFrontType = StorefrontType.valueOf(type.toUpperCase());
        storeFront.setType(storeFrontType);
        return saveStoreFront(storeFront, selected);
    }

    @PostMapping("/edit/{type}")
    public Storefront editStorefront(@PathVariable String type, Storefront storeFront, HttpServletRequest request){
        StorefrontType storeFrontType = StorefrontType.valueOf(type.toUpperCase());
        storeFront.setType(storeFrontType);
        return editStoreFront(storeFront, request);
    }

    private Storefront saveStoreFront(Storefront storeFront, int[] selected){
        System.out.println(Arrays.toString(selected));
        switch (storeFront.getType()){
            case TEXT, ALL_CATEGORIES -> {
                return storeFrontService.saveNewStoreFront(storeFront);
            }
            case CATEGORY, BRAND, ARTICLE, PRODUCT -> {
                Storefront front = addSelectedModels(storeFront, selected);
                return storeFrontService.saveNewStoreFront(front);
            }
            default -> throw new CustomException(HttpStatus.BAD_REQUEST, "Parameter not recognized");
        }
    }
    private Storefront editStoreFront(Storefront storeFront, HttpServletRequest request){
        switch (storeFront.getType()){
            case TEXT, ALL_CATEGORIES -> {
                return storeFrontService.editStoreFront(storeFront);
            }
            default -> throw new CustomException(HttpStatus.BAD_REQUEST, "Parameter not recognized");
        }
    }
    private Storefront addSelectedModels(Storefront storefront, int[] selectedIds){
        for (int i = 0; i < selectedIds.length; i++) {
            StorefrontModel model = new StorefrontModel();
            model.setType(storefront.getType());
            model.setPosition(i + 1);
            model.setModel(selectedIds[i]);
            storefront.addModel(model);
        }
        return storefront;
    }
}
