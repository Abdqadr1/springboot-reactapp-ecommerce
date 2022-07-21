package com.qadr.ecommerce.sharedLibrary.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Contact {
    private String name;
    private String email;
    private String message;
}
