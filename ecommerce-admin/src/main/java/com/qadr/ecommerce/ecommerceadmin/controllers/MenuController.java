package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.service.MenuService;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.article.ArticleType;
import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.repo.ArticleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired private MenuService menuService;
    @Autowired private ArticleRepo articleRepo;

    @GetMapping("/articles")
    public List<Article> getAllArticles(){
        return articleRepo.findAllByArticleType(ArticleType.MENU_BOUND);
    }

    @PostMapping("/move")
    public List<Menu> moveMenu(@Valid @RequestBody MenuService.MoveDTO moveDTO){
        return menuService.movePosition(moveDTO);
    }

    @GetMapping("/page/{number}")
    public Map<String, Object> listByPage(@PathVariable("number") Integer number){

        return menuService.getPage(number);
    }

    @PostMapping("/new")
    public Menu addMenu(Menu menu){
        return menuService.saveMenu(menu);
    }

    @PostMapping("/edit")
    public Menu updateMenu(Menu menu){
        return menuService.editMenu(menu);
    }

    @GetMapping("/delete/{id}")
    public void deleteMenu(@PathVariable("id") Integer id){
        menuService.deleteMenu(id);
    }

    @GetMapping("/{id}/enable/{status}")
    public void updateEnabled(@PathVariable("id") Integer id,
                              @PathVariable("status") boolean status){
        menuService.updateStatus(id, status);
    }
}
