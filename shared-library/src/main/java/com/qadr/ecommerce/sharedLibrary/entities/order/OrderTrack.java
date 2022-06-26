package com.qadr.ecommerce.sharedLibrary.entities.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.qadr.ecommerce.sharedLibrary.entities.IdBasedEntity;
import lombok.*;
import org.hibernate.Hibernate;
import org.springframework.format.datetime.DateFormatter;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import java.util.SimpleTimeZone;

@Entity
@Table(name = "order_track")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class OrderTrack extends IdBasedEntity {
    @Column(nullable = false, length = 255)
    private String note;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Date updatedTime;

    @Transient
    public String getTimeInForm(){
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm");
        return dateFormatter.format(updatedTime);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderTrack that = (OrderTrack) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
