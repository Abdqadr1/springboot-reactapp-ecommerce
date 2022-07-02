package com.qadr.ecommerce.sharedLibrary.entities.order;

import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.sharedLibrary.entities.AddressBasedEntity;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Entity
@Table(name = "orders")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Order extends AddressBasedEntity {

    @NotBlank(message = "Enter country")
    @Size(max = 45, message = "country is too long")
    @Column(nullable = false, length = 45)
    private String country;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<OrderDetail> orderDetails = new HashSet<>();


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("updatedTime ASC")
    @ToString.Exclude
    private List<OrderTrack> orderTracks = new ArrayList<>();

    private Date orderTime;
    private Date deliveryDate;

    private int deliveryDays;

    private float shippingCost;
    private float productCost;
    private float subtotal;
    private float tax;
    private float total;

    public Order(Integer id, Date orderTime, float productCost, float subtotal, float total) {
        this.id = id;
        this.orderTime = orderTime;
        this.productCost = productCost;
        this.subtotal = subtotal;
        this.total = total;
    }

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    public String getDeliveryDateOnForm(){
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        return dateFormatter.format(deliveryDate);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Order order = (Order) o;
        return id != null && Objects.equals(id, order.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void copyShippingAddress(Address address){
        setFirstName(address.getFirstName());
        setLastName(address.getLastName());
        setPhoneNumber(address.getPhoneNumber());
        setMainAddress(address.getMainAddress());
        setExtraAddress(address.getExtraAddress());
        setCity(address.getCity());
        setState(address.getState());
        setPostalCode(address.getPostalCode());
        setCountry(address.getCountry().getName());
    }

    public boolean hasStatus(OrderStatus status){
        return orderTracks
                .stream()
                .anyMatch(orderTrack -> orderTrack.getStatus().equals(status));
    }

}
