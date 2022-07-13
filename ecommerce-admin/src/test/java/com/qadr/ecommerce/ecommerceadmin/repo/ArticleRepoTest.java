package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.article.ArticleType;
import com.qadr.ecommerce.sharedLibrary.repo.ArticleRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.parameters.P;
import org.springframework.test.annotation.Rollback;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
class ArticleRepoTest {
    @Autowired private ArticleRepo repo;

    @Test
    void testAddArticle(){
        Article article = new Article();
        article.setArticleType(ArticleType.MENU_BOUND);
        article.setTitle("Terms and Conditions");
        article.setAlias("terms_and_conditions");
        article.setPublished(false);
        article.setContent("You have to know this before you continue with us.");
        article.setUpdatedTime(new Date());
        article.setUser(new User(3L));

        Article save = repo.save(article);
        assertThat(save).isNotNull();
        System.out.println(save);
    }

    @Test
    void testFindArticleById(){
        int id = 2;
        Optional<Article> byId = repo.findById(2);
        assertThat(byId).isPresent();
        Article article = byId.get();
        assertThat(article.getId()).isEqualTo(id);
        System.out.println(article);
    }

    @Test
    void testUpdateArticle(){
        int id = 2;
        Optional<Article> byId = repo.findById(2);
        assertThat(byId).isPresent();
        Article article = byId.get();
        article.setPublished(true);
        Article save = repo.save(article);
        assertThat(save.isPublished()).isTrue();
        System.out.println(save);
    }

    @Test
    void testDeleteArticle(){
        int id = 4;
        repo.deleteById(id);
        Optional<Article> byId = repo.findById(2);
        assertThat(byId).isNotPresent();
    }

    @Test
    void testUpdateArticleStatus(){
        int id = 5;
        Optional<Article> byId = repo.findById(id);
        assertThat(byId).isPresent();
        repo.updateStatus(id, true);
    }

    @Test
    void searchKeyword() {
        String keyword = "about";
        PageRequest pageRequest = PageRequest.of(0, 3);
        Page<Article> articlePage = repo.searchKeyword(keyword, pageRequest);
        assertThat(articlePage.getTotalElements()).isGreaterThan(0);
        System.out.println(articlePage.getContent());
    }

    @Test
    void testFindByAlias(){
        String alias = "about_us";
        Optional<Article> byAlias = repo.findByAlias(alias);
        assertThat(byAlias).isPresent();
        Article article = byAlias.get();
        System.out.println(article);
    }

    @Test
    void testFindByTitle(){
        String title = "Terms and Conditions";
        Optional<Article> byTitle = repo.findByTitle(title);
        assertThat(byTitle).isPresent();
        Article article = byTitle.get();
        System.out.println(article);
    }
}