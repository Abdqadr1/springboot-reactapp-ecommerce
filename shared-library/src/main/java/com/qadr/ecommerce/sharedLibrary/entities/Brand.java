package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.qadr.ecommerce.sharedLibrary.entities.Category;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "brands")
@Data
@AllArgsConstructor @NoArgsConstructor
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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

    public void addCategory(Category category) {
        this.categories.add(category);
    }

    public String toString(){
        return name;
    }

}
