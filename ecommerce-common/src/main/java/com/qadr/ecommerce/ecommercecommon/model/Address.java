package com.qadr.ecommerce.ecommercecommon.model;

import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Objects;

@Entity
@Table(name = "addresses")
@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Enter first name")
    @Size(max = 45, message = "first name os too long")
    @Column(nullable = false, length = 45)
    private String firstName;


    @NotBlank(message = "Enter last name")
    @Size(max = 45, message = "last name too long")
    @Column(nullable = false, length = 45)
    private String lastName;


    @NotBlank(message = "Enter phone number")
    @Size(max = 15, message = "Enter a valid phone number")
    @Column(nullable = false, length = 15)
    private String phoneNumber;


    @NotBlank(message = "Enter address line 1")
    @Size(max = 64, message = "address line 1 is too long")
    @Column(nullable = false, length = 64)
    private String mainAddress;

    @Size(max = 64, message = "address line 2 is too long")
    @Column(length = 64)
    private String extraAddress = "";

    @NotBlank(message = "Enter state")
    @Size(max = 45, message = "state is too long")
    @Column(nullable = false, length = 45)
    private String state;

    @NotBlank(message = "Enter city")
    @Size(max = 45, message = "city is too long")
    @Column(nullable = false, length = 45)
    private String city;

    @NotBlank(message = "Enter postal code")
    @Size(max = 15, message = "postal code is too long")
    @Column(nullable = false, length = 15)
    private String postalCode;

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
}
