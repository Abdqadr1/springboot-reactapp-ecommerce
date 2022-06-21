package com.qadr.ecommerce.ecommercecommon.model;

import lombok.Getter;
import lombok.Setter;

import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;

@Getter @Setter
public class CheckoutInfo {
    private float productCost;
    private float shippingCostTotal;
    private float productTotal;
    private float paymentTotal;
    private int deliveryDays;
    private Date deliveryDate;
    private boolean codSupported;

    public Date getDeliveryDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, deliveryDays);
        return calendar.getTime();
    }

    public String getPaymentForPayPal(){
        String pattern = "###,###.##";
        DecimalFormat formatter = new DecimalFormat(pattern);
        return formatter.format(paymentTotal);
    }
}
