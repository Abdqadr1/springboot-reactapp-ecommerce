package com.qadr.ecommerce.sharedLibrary.entities.article;

import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Entity @Table(name = "tables")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Article  extends IdBasedEntity {
    private String title;
    private String alias;
    private String content;

    @Enumerated(EnumType.STRING)
    private ArticleType articleType;

    private Date updatedTime;
    private boolean published;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
