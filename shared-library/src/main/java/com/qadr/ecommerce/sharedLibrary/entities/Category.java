package com.qadr.ecommerce.sharedLibrary.entities;

import com.fasterxml.jackson.annotation.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity @Table(name = "categories")
@Getter @NoArgsConstructor
@Setter
public class Category extends IdBasedEntity{

    @NotBlank
    @Column(nullable = false, length = 128, unique = true, name = "name")
    private String name;

    @NotBlank
    @Column(length = 64, unique = true, nullable = false, name = "alias")
    private String alias;

    private boolean enabled;

    private String photo;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @OneToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @JsonManagedReference
    @OneToMany(mappedBy = "parent")
    @OrderBy("name asc")
    private Set<Category> children = new HashSet<>();

    @Column(name = "all_parent_ids")
    private String allParentIds;

    public Category(Integer id){
        this.id = id;
    }

    public Category(String name){
        this.name = name;
        this.alias = name;
    }

    public Category(String name, Category parent){
        this(name);
        this.parent = parent;
    }

    public Category(Integer id, String name){
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
