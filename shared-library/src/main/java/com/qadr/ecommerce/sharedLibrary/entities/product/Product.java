package com.qadr.ecommerce.sharedLibrary.entities.product;

import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.Constants;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Entity @Table(name = "products")
@NoArgsConstructor @Getter @Setter
public class Product extends IdBasedEntity {

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
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

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> extraImages = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductDetail> details = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "store_front_id")
    private StoreFront storeFront;

    private int reviewCount;
    private int questionCount;
    private float averageRating;

    @Transient private boolean customerCanReview;
    @Transient private boolean reviewedByCustomer;

    public Product(String productName) {
        this.name = productName;
    }

    public String getShortName(){
        if(name.length() <= 40 ) return name;
        return name.substring(0, 40);
    }

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

    public Product(Integer id){
        this.id = id;
    }

    @Override
    public String toString() {
        return "Product{" +
                "name='" + name + '\'' +
                '}';
    }

    public String getMainImagePath(){
        return Constants.S3_BASE_URI + "product-images/" + id +"/"+ mainImage;
    }

    public float getRealPrice(){
        float realPrice;
        if(discountPrice > 0){
            realPrice = price * (100 - discountPrice) / 100;
        }else {
            realPrice = price;
        }
        return realPrice;
    }
}
