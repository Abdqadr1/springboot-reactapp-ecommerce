package com.qadr.ecommerce.sharedLibrary.entities.menu;

import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;


@Entity
@Table(name = "menus")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Menu extends IdBasedEntity {

    @Column(length = 150, nullable = false, unique = true)
    private String title;

    @Column(length = 150, nullable = false, unique = true)
    private String alias;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @Enumerated(EnumType.STRING)
    private MenuType type;

    private int position;

    private boolean enabled;

    public void moveUp(){
        position--;
    }
    public void moveDown(){
        position++;
    }
}
