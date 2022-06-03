package com.qadr.ecommerce.ecommerceadmin.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    @Column(unique = true, nullable = false, length = 150)
    @Size(min = 5, max = 150)
    private String email;

    @Column(length = 64, nullable = false)
    @NotBlank
    private String password;

    @Column(length = 50, nullable = false)
    @Size(min = 1, max = 50)
    private String  firstName;

    @Column(length = 50, nullable = false)
    @Size(min = 1, max = 50)
    private String lastName;

    private boolean enabled;

    private String photo;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public User(String email, String password, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public void addRole(Role role){
        this.roles.add(role);
    }

}
