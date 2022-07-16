package com.qadr.ecommerce.sharedLibrary.entities.storefront;

import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "store_fronts")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class StoreFront extends IdBasedEntity {
    @Size(min = 10, max = 100, message = "heading should be between 10-100 characters")
    @Column(length = 100)
    private String heading;

    @Size(max = 300, message = "description should be between 10-300 characters")
    @Column(length = 300)
    private String description;

    @Enumerated(EnumType.STRING)
    private StoreFrontType type;
    private int position;
    private boolean enabled;

    @OneToMany(mappedBy = "storeFront", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    private Set<Article> articlesList = new HashSet<>();

    @OneToMany(mappedBy = "storeFront", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    private Set<Brand> brandsList = new HashSet<>();

    @OneToMany(mappedBy = "storeFront", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    private Set<Category> categoryList = new HashSet<>();

    @OneToMany(mappedBy = "storeFront", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    private Set<Product> productList = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        StoreFront that = (StoreFront) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
