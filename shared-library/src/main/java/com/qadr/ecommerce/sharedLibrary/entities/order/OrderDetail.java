package com.qadr.ecommerce.sharedLibrary.entities.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class OrderDetail extends IdBasedEntity {

    private int quantity;
    private float shippingCost;
    private float productCost;
    private float subtotal;
    private float unitPrice;

    public OrderDetail(String categoryName, int quantity, float shippingCost, float productCost, float subtotal) {
        this.product = new Product();
        this.product.setCategory(new Category(categoryName));
        this.quantity = quantity;
        this.shippingCost = shippingCost;
        this.productCost = productCost * quantity;
        this.subtotal = subtotal;
    }

    public OrderDetail(int quantity,String productName, float shippingCost, float productCost, float subtotal) {
        this.product = new Product(productName);
        this.quantity = quantity;
        this.shippingCost = shippingCost;
        this.productCost = productCost * quantity;
        this.subtotal = subtotal;
    }

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderDetail that = (OrderDetail) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}