package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@MappedSuperclass
@Getter @Setter
public class AddressBasedEntity extends IdBasedEntity {

    @NotBlank(message = "Enter first name")
    @Size(max = 45, message = "first name os too long")
    @Column(nullable = false, length = 45)
    protected String firstName;

    @NotBlank(message = "Enter last name")
    @Size(max = 45, message = "last name too long")
    @Column(nullable = false, length = 45)
    protected String lastName;


    @NotBlank(message = "Enter phone number")
    @Size(max = 15, message = "Enter a valid phone number")
    @Column(nullable = false, length = 15)
    protected String phoneNumber;


    @NotBlank(message = "Enter address line 1")
    @Size(max = 64, message = "address line 1 is too long")
    @Column(nullable = false, length = 64)
    protected String mainAddress;

    @Size(max = 64, message = "address line 2 is too long")
    @Column(length = 64)
    protected String extraAddress = "";

    @NotBlank(message = "Enter state")
    @Size(max = 45, message = "state is too long")
    @Column(nullable = false, length = 45)
    protected String state;

    @NotBlank(message = "Enter city")
    @Size(max = 45, message = "city is too long")
    @Column(nullable = false, length = 45)
    protected String city;

    @NotBlank(message = "Enter postal code")
    @Size(max = 15, message = "postal code is too long")
    @Column(nullable = false, length = 15)
    protected String postalCode;

}
