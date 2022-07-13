package com.qadr.ecommerce.sharedLibrary.entities.article;

import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Size;
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
}
