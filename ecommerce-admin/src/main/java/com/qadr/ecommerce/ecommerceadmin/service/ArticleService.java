package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.ArticleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ArticleService {
    public static final int ARTICLES_PER_PAGE = 5;
    @Autowired private ArticleRepo repo;

    public Map<String, Object> getPage(Integer number, PagingAndSortingHelper helper) {
        return helper.getPageInfo(number, ARTICLES_PER_PAGE, repo);
    }
    public void updateStatus(Integer id, boolean status) {
        get(id);

        repo.updateStatus(id, status);
    }

    private Article get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find Article"));
    }

    public void validateArticleUniqueProps(Article article, Integer id){
        Optional<Article> byTitle = repo.findByTitle(article.getTitle());
        if (byTitle.isPresent() && !byTitle.get().getId().equals(id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Title already exists");
        }
        Optional<Article> byAlias = repo.findByAlias(article.getAlias());
        if (byAlias.isPresent() && !byAlias.get().getId().equals(id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");
        }
    }

    public Article saveArticle(Article article, User user){
        if(article.getAlias().isBlank()){
            article.setAlias(article.getTitle().replaceAll(" ", "_"));
        }
        validateArticleUniqueProps(article, null);
        article.setUser(user);
        article.setUpdatedTime(new Date());
        return repo.save(article);
    }
    public Article updateArticle(Article article, User user){
        if (article.getId() != null){
            Article articleInDb = get(article.getId());
            validateArticleUniqueProps(article, article.getId());
            if(article.getAlias().isBlank()){
                article.setAlias(articleInDb.getAlias());
            }
            article.setUser(user);
            article.setUpdatedTime(new Date());
            return repo.save(article);
        }else throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid request");
    }

    public void deleteArticle(Integer id) {
        get(id);
        repo.deleteById(id);
    }
}
