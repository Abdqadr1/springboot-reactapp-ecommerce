package com.qadr.ecommerce.sharedLibrary.entities;

import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@MappedSuperclass
@Getter @Setter
public abstract class IdBasedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;
}
