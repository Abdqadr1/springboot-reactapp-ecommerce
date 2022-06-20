package com.qadr.ecommerce.ecommercecommon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "cart_items")
@Getter @Setter
@RequiredArgsConstructor
public class CartItem extends IdBasedEntity {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(length = 5, nullable = false)
    private Integer quantity;

    public CartItem (Integer id){
        this.id = id;
    }

    public CartItem (Integer quantity, Customer customer, Product product){
        this.customer = customer;
        this.product = product;
        this.quantity = quantity;
    }
    public CartItem (Customer customer, Product product){
        this.customer = customer;
        this.product = product;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", customer=" + customer.getId() +
                ", product=" + product.getId() +
                ", quantity=" + quantity +
                '}';
    }

    public Float getSubTotal(){
        float price;
        if(product.getDiscountPrice() > 0){
            price = product.getPrice() * (100 - product.getDiscountPrice()) / 100;
        }else {
            price = product.getPrice();
        }
//        float total = price * quantity;
//        System.out.printf("%f * %d = %f%n", price, quantity, total);
        return price * quantity;
    }

}
