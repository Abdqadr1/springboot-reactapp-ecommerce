package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.article.ArticleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepo extends SearchRepository<Article, Integer> {

    List<Article> findAllByArticleType(ArticleType type);

    List<Article> findByPublished(boolean b);

    @Query("SELECT a FROM Article a WHERE a.title LIKE %?1% OR a.content LIKE %?1%")
    Page<Article> searchKeyword(String keyword, Pageable pageable);

    @Query("SELECT a FROM Article a")
    Page<Article> find(String keyword, Integer id, String catId, Pageable pageable);

    Optional<Article> findByAlias(String alias);

    Optional<Article> findByTitle(String title);


    @Modifying
    @Query("UPDATE Article a SET a.published=?2 WHERE a.id=?1")
    void updateStatus(Integer id, boolean status);
}
