package com.qadr.ecommerce.ecommercecommon.controllers;

import com.qadr.ecommerce.ecommercecommon.service.MenuService;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired private MenuService menuService;

    @GetMapping
    public Map<String, Object> getMenus(){
        return menuService.getMenus();
    }

    @GetMapping("/alias/{alias}")
    public Article getMenu(@PathVariable String alias){
        return menuService.getArticleByAlias(alias);
    }

}
