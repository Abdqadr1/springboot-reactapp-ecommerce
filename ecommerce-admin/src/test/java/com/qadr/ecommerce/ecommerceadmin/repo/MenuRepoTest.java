package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import com.qadr.ecommerce.sharedLibrary.repo.MenuRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class MenuRepoTest {
    @Autowired private MenuRepo repo;


    @Test
    void testAddMenu(){
        Menu menu  = new Menu();
        menu.setTitle("Policy");
        menu.setAlias("policy");
        menu.setPosition(3);
        menu.setEnabled(true);
        menu.setType(MenuType.FOOTER_MENU);
        menu.setArticle(new Article(9));
        Menu save = repo.save(menu);
        assertThat(save).isNotNull();
        System.out.println(save);
    }

    @Test
    void testListAll(){
        List<Menu> all = repo.findAll();
        all.forEach(System.out::println);
    }

    @Test
    void testUpdateMenu(){
        int id = 1;
        Optional<Menu> byId = repo.findById(id);
        assertThat(byId).isPresent();
        Menu menu = byId.get();
        menu.setArticle(new Article(9));
        Menu save = repo.save(menu);
        assertThat(save).isNotNull();
        System.out.println(save);
    }
    @Test
    void findByAlias() {
        String alias = "about";
        Optional<Menu> byAlias = repo.findByAlias(alias);
        assertThat(byAlias).isPresent();
        System.out.println(byAlias);
    }

    @Test
    void findByTitle() {
        String title = "terms";
        Optional<Menu> byTitle = repo.findByTitle(title);
        assertThat(byTitle).isPresent();
        System.out.println(byTitle);
    }

    @Test
    void testDeleteMenu(){
        int id = 5;
        repo.deleteById(id);
        Optional<Menu> byId = repo.findById(id);
        assertThat(byId).isNotPresent();
    }

    @Test
    void findMaxPositionForType() {
        MenuType type = MenuType.FOOTER_MENU;
        int max = repo.findMaxPositionForType(type);
        assertThat(max).isEqualTo(2);
    }
}