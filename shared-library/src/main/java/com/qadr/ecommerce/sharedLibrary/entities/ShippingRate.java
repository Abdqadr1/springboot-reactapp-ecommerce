package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

@Entity
@Table(name = "shipping_rates")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class ShippingRate extends IdBasedEntity{
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @NotBlank(message = "Enter state")
    @Size(max = 45, message = "state cannot be longer than 45 characters")
    @Column(nullable = false, length = 45)
    private String state;

    @NotNull(message = "Enter rate")
    private Float rate;

    @NotNull(message = "Enter days")
    private Integer days;

    @Column(name = "cod_supported")
    private boolean COD;

    public Country getCountry() {
        return country;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ShippingRate that = (ShippingRate) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
