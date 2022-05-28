package com.qadr.ecommerceadmin.model;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.parameters.P;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity @Table(name = "products")
@NoArgsConstructor @Getter @Setter @Data
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

    @Column(nullable = false)
    private String mainImage;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private Set<ProductImage> extraImages = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private Set<ProductDetail> details = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    public Brand getBrand() {
        return brand;
    }

    public Category getCategory() {
        return category;
    }

    public void addImage(String filename){
        extraImages.add(new ProductImage(filename, this));
    }

    public void addDetail(String key, String value){
        details.add(new ProductDetail(key, value, this));
    }

}
