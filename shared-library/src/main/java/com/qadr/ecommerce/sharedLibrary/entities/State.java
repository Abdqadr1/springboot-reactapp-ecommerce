package com.qadr.ecommerce.sharedLibrary.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerator;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "states")
@Getter
@Setter
@NoArgsConstructor
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 64)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @Override
    public String toString() {
        return "[name = "+name+", country = "+country.toString()+" ]";
    }

    public State(Integer id, String name){
        this.id = id;
        this.name = name;
    }

    public State(String name){
        this.name = name;
    }

    public State(String name, Country country){
        this.name = name;
        this.country = country;
    }


}
