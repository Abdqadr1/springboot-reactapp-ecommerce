package com.qadr.ecommerceadmin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Column(nullable = false, length = 128, unique = true)
    private String name;

    @NotBlank
    @Column(length = 64, unique = true, nullable = false)
    private String alias;

    private boolean enabled;

    private String photo;

    @OneToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @JsonIgnore
    @OneToMany(mappedBy = "parent")
    private Set<Category> children = new HashSet<>();

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
