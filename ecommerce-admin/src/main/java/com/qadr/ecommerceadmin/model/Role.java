package com.qadr.ecommerceadmin.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(max = 40, min = 2) @NotBlank
    @Column(unique = true, length = 40, nullable = false)
    private String name;


    @Size(max = 150, min = 10) @NotBlank
    @Column(length = 150, nullable = false)
    private String description;

    public Role(String name, String desc) {
        this.name = name;
        this.description = desc;
    }

    public Role(Integer id) {
        this.id = id;
    }

    public String toString(){
        return name;
    }

}
