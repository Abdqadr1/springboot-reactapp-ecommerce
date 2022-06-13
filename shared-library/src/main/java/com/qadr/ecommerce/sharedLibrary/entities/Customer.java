package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "customers")
@Getter @Setter @RequiredArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Email(message = "Enter a valid email address")
    @Size(max = 64, message = "Email address is too long")
    @Column(nullable = false,unique = true, length = 64)
    private String email;


    @NotBlank(message = "Enter your first name")
    @Size(max = 45, message = "first name os too long")
    @Column(nullable = false, length = 45)
    private String firstName;

    @Size(max = 64, message = "Password can not be less than 8 characters")
    @Column(nullable = false, length = 64)
    private String password;

    @NotBlank(message = "Enter your last name")
    @Size(max = 45, message = "last name too long")
    @Column(nullable = false, length = 45)
    private String lastName;


    @NotBlank(message = "Enter your phone number")
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

    @NotBlank(message = "Enter your state")
    @Size(max = 45, message = "state is too long")
    @Column(nullable = false, length = 45)
    private String state;

    @NotBlank(message = "Enter your city")
    @Size(max = 45, message = "city is too long")
    @Column(nullable = false, length = 45)
    private String city;

    @NotBlank(message = "Enter postal code")
    @Size(max = 15, message = "postal code is too long")
    @Column(nullable = false, length = 15)
    private String postalCode;

    @Column(length = 64)
    private String verificationCode;

    private boolean enabled;

    private LocalDateTime createdTime;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, name = "authentication_type")
    private AuthType authenticationType;

    @Override
    public String toString() {
        return "[email = " + email +", " +
                " firstName = "+firstName+"," +
                "lastName= "+lastName+"," +
                "enabled = "+ enabled +" ]";
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
