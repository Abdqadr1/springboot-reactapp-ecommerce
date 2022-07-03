package com.qadr.ecommerce.sharedLibrary.entities;

import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@Entity @Table(name = "reviews")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Review extends IdBasedEntity {
    @Column(length = 100)
    private String headline;
    @Column(length = 400)
    private String comment;
    private int rating;
    private Date reviewTime;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Review review = (Review) o;
        return id != null && Objects.equals(id, review.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    @Transient
    public String getFormattedTime(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        return simpleDateFormat.format(reviewTime);
    }
}
