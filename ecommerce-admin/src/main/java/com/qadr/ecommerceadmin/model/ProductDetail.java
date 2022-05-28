package com.qadr.ecommerceadmin.model;

import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "product_details")
@NoArgsConstructor
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String value;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public ProductDetail (Integer id){
        this.id = id;
    }

    public ProductDetail(String name, String value, Product product){
        this.name = name;
        this.value = value;
        this.product = product;
    }

    public ProductDetail(String name, String value){
        this.name = name;
        this.value = value;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() { return value;}

    public void setValue(String value) {this.value = value;}

    @Override
    public String toString() {
        return "ProductDetail{" +
                "name='" + name + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
