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
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "store_fronts")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Storefront extends IdBasedEntity {
    @Size(min = 10, max = 100, message = "heading should be between 10-100 characters")
    @Column(length = 100)
    private String heading;

    @Size(max = 500, message = "description should be between 10-500 characters")
    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private StorefrontType type;
    private int position;
    private boolean enabled;

    @OneToMany(mappedBy = "storefront", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<StorefrontModel> models = new HashSet<>();

    public void setModels(Set<StorefrontModel> models) {
        this.models.clear();
        this.models.addAll(models);
    }

    public Storefront(Integer id){
        this.id = id;
    }


    public void addModel(StorefrontModel model){
        model.setStorefront(this);
        models.add(model);
    }

    public void moveUp(){
        position--;
    }
    public void moveDown(){
        position++;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Storefront that = (Storefront) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
