package com.qadr.ecommerce.sharedLibrary.entities.product;

import com.qadr.ecommerce.sharedLibrary.entities.Constants;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Table(name = "product_images")
@NoArgsConstructor
public class ProductImage extends IdBasedEntity {
    @Column(nullable = false)
    private String path;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public ProductImage(Integer id){this.id = id;}

    public ProductImage(String path, Product product) {
        this.path = path;
        this.product = product;
    }

    public ProductImage(Integer id, String path, Product product) {
        this.id = id;
        this.path = path;
        this.product = product;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getImagePath(){
        return Constants.S3_BASE_URI + "product-images/" + product.getId() +"/extras/"+ path;
    }
}
