package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "addresses")
@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class Address extends AddressBasedEntity {

    private boolean defaultAddress;

    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    public Address(Integer id){
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Address address = (Address) o;
        return id != null && Objects.equals(id, address.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public String toString(){
        return firstName + " " + lastName + ", " + mainAddress
                +", " + extraAddress + ", " + city + ", " + state
                + ", " + country.getName() + ". Postal Code : " + postalCode
                + ", Phone Number: " + phoneNumber + ".";
    }

}
