package com.qadr.ecommerce.sharedLibrary.entities;

import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
@Entity
@Table(name = "brands")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class Brand extends IdBasedEntity{

    @Column(nullable = false, length = 128, unique = true)
    private String name;

    @Column(nullable = false)
    private String photo;

    @ManyToMany (fetch = FetchType.EAGER)
    @JoinTable(
            name = "category_brand",
            joinColumns = @JoinColumn(name = "brand_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "store_front_id")
    private StoreFront storeFront;

    public Brand(Integer id){
        this.id = id;
        this.photo = "default.png";
    }

    public Brand(Integer id, String name){
        this.id = id;
        this.name = name;
    }

    public Brand(String name){
        this.name = name;
        this.photo = "default.png";
    }

    public String getImagePath(){
        return Constants.S3_BASE_URI + "brand-photos/" + id +"/"+ photo;
    }

    public void addCategory(Category category) {
        this.categories.add(category);
    }

    public String toString(){
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Brand brand = (Brand) o;
        return getId() != null && Objects.equals(getId(), brand.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
