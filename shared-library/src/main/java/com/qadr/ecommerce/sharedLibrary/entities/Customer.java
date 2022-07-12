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
public class Customer extends  AddressBasedEntity{

    @Email(message = "Enter a valid email address")
    @Size(max = 64, message = "Email address is too long")
    @Column(nullable = false,unique = true, length = 64)
    private String email;

    @Size(max = 64, message = "Password can not be less than 8 characters")
    @Column(nullable = false, length = 64)
    private String password;

    @Column(length = 64)
    private String verificationCode;

    @Column(length = 30)
    private String resetToken;

    private boolean enabled;

    private LocalDateTime createdTime;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, name = "authentication_type")
    private AuthType authenticationType;

    public Customer(Integer id){
        this.id = id;
    }
    public Customer(String email){this.email = email;}

    @Override
    public String toString() {
        return "[email = " + email +", " +
                " firstName = "+firstName+"," +
                "lastName= "+lastName+"," +
                "enabled = "+ enabled +" ]";
    }

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
