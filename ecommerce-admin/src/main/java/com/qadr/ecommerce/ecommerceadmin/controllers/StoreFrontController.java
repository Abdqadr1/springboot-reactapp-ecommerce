package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.StoreFrontService;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFrontType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/storefront")
public class StoreFrontController {
    @Autowired private StoreFrontService storeFrontService;

    @PostMapping("/move")
    public List<StoreFront> moveMenu(@Valid @RequestBody StoreFrontService.MoveDTO moveDTO){
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
    public List<StoreFront> listByPage(){
        return storeFrontService.getAll();
    }

    @PostMapping("/new/{type}")
    public StoreFront newStorefront(@PathVariable String type, StoreFront storeFront, HttpServletRequest request){
        StoreFrontType storeFrontType = StoreFrontType.valueOf(type.toUpperCase());
        storeFront.setType(storeFrontType);
        return saveStoreFront(storeFront, request);
    }

    @PostMapping("/edit/{type}")
    public StoreFront editStorefront(@PathVariable String type, StoreFront storeFront, HttpServletRequest request){
        StoreFrontType storeFrontType = StoreFrontType.valueOf(type.toUpperCase());
        storeFront.setType(storeFrontType);
        return editStoreFront(storeFront, request);
    }

    private StoreFront saveStoreFront(StoreFront storeFront, HttpServletRequest request){
        switch (storeFront.getType()){
            case TEXT, ALL_CATEGORIES -> {
                return storeFrontService.saveNewStoreFront(storeFront);
            }
            default -> throw new CustomException(HttpStatus.BAD_REQUEST, "Parameter not recognized");
        }
    }
    private StoreFront editStoreFront(StoreFront storeFront, HttpServletRequest request){
        switch (storeFront.getType()){
            case TEXT, ALL_CATEGORIES -> {
                return storeFrontService.editStoreFront(storeFront);
            }
            default -> throw new CustomException(HttpStatus.BAD_REQUEST, "Parameter not recognized");
        }
    }
}
