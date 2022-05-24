package com.qadr.ecommerceadmin.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity @Table(name = "products")
@NoArgsConstructor @Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 256)
    private String name;

    @Column(unique = true, nullable = false, length = 256)
    private String alias;

    @Column(nullable = false, length = 512)
    private String shortDescription;

    @Column(nullable = false, length = 4096)
    private String fullDescription;

    private Date createdTime;
    private Date updatedTime;

    private boolean enabled;
    private boolean inStock;

    private float cost;
    private float price;
    private float discountPrice;

    private float length;
    private float width;
    private float height;
    private float weight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    public Brand getBrand() {
        return brand;
    }

    public Category getCategory() {
        return category;
    }

}
