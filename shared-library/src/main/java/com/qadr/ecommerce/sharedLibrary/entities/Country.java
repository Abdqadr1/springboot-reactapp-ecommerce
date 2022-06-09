package com.qadr.ecommerce.sharedLibrary.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "countries")
@RequiredArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 64)
    private String name;

    @Column(nullable = false,unique = true, length = 5)
    private String code;

    @OneToMany(mappedBy = "country")
    private Set<State> states;

    public Country (Integer id){
        this.id = id;
    }

    public Country(Integer id, String name){
        this.id = id;
        this.name = name;
    }

    public Country(String name, String code){
        this.name = name;
        this.code = code;
    }

    public Country(Integer id, String name, String code){
        this.id = id;
        this.name = name;
        this.code = code;
    }

    public void addState(String name){
        states.add(new State(name, this));
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Country country = (Country) o;
        return id != null && Objects.equals(id, country.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "[ name = " + name +
                ", code = " + code +
                "]";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
