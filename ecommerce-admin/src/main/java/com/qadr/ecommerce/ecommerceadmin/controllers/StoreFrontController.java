package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.StoreFrontService;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MoveType;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/storefront")
public class StoreFrontController {
    @Autowired private StoreFrontService storeFrontService;


    @PostMapping("/move")
    public List<StoreFront> moveMenu(@RequestParam("id") Integer id, @RequestParam("move") String move){
        MoveType moveType = MoveType.valueOf(move.toUpperCase());
        return storeFrontService.movePosition(id, moveType);
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
}
