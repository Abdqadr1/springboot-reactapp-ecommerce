package com.qadr.ecommerce.sharedLibrary.entities.article;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity @Table(name = "articles")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Article  extends IdBasedEntity {
    @Column(length = 150, nullable = false, unique = true)
    private String title;

    @Column(length = 150, nullable = false, unique = true)
    private String alias;

    @ToString.Exclude
    @Column(length = 10000, nullable = false)
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ArticleType articleType;

    @Column(nullable = false)
    private Date updatedTime;

    @Column(nullable = false)
    private boolean published;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Article (Integer id){
        this.id = id;
    }


    public String getFormattedUpdatedTime(){
        if(updatedTime != null){
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            return dateFormat.format(updatedTime);
        }
        return "";
    }
}
