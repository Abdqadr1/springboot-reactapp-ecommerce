package com.qadr.ecommerce.sharedLibrary.entities.storefront;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Fetch;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "storefront_models")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class StorefrontModel extends IdBasedEntity {

    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "storefront_id")
    private Storefront storefront;

    private int position;

    @Enumerated(EnumType.STRING)
    private StorefrontType type;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public void setModel(int id){
        if(type.equals(StorefrontType.BRAND)){
            setBrand(new Brand(id));
        }
        if(type.equals(StorefrontType.CATEGORY)){
            setCategory(new Category(id));
        }
        if(type.equals(StorefrontType.ARTICLE)){
            setArticle(new Article(id));
        }
        if(type.equals(StorefrontType.PRODUCT)){
            setProduct(new Product(id));
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        StorefrontModel that = (StorefrontModel) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
