package com.qadr.ecommerce.ecommercecommon.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PayPalOrderResponse {
    private String id;
    private String status;

    public boolean validate(String orderId){
        return id.equals(orderId) && status.equals("COMPLETED");
    }

}
