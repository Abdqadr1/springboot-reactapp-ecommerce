package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.CartItem;
import com.qadr.ecommerce.ecommercecommon.model.CheckoutInfo;
import com.qadr.ecommerce.sharedLibrary.entities.ShippingRate;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckoutService {
    public static final int DIM_DIVISOR = 139;

    public CheckoutInfo prepareCheckout(List<CartItem> cartItems, ShippingRate shippingRate){
        CheckoutInfo checkoutInfo = new CheckoutInfo();
        checkoutInfo.setProductCost(calculateProductCost(cartItems));

        float productTotal = calculateProductTotal(cartItems);
        float shippingCostTotal = calculateShippingCostTotal(cartItems, shippingRate);

        checkoutInfo.setProductTotal(productTotal);
        checkoutInfo.setShippingCostTotal(shippingCostTotal);
        float paymentTotal = productTotal + shippingCostTotal;
        checkoutInfo.setPaymentTotal(paymentTotal);

        checkoutInfo.setDeliveryDays(shippingRate.getDays());
        checkoutInfo.setCodSupported(shippingRate.isCOD());
        return  checkoutInfo;
    }

    private float calculateShippingCostTotal(List<CartItem> cartItems, ShippingRate shippingRate) {
        float shippingCostTotal = 0.0f;
        for (CartItem item : cartItems){
            Product product = item.getProduct();
            float dimWeight = product.getHeight() * product.getWidth() * product.getLength() / DIM_DIVISOR;
            float finalWeight = Math.max(dimWeight, product.getWeight());
            float shippingCost = finalWeight * item.getQuantity() * shippingRate.getRate();
            item.setShippingCost(shippingCost);

            shippingCostTotal += shippingCost;
        }
        return shippingCostTotal;
    }

    private float calculateProductTotal(List<CartItem> cartItems) {
        float total = 0.0f;
        for (CartItem item : cartItems){
            total += item.getSubtotal();
        }
        return total;
    }

    private float calculateProductCost(List<CartItem> cartItems) {
        float total = 0.0f;
        for (CartItem item : cartItems){
            total += item.getProduct().getCost();
        }
        return total;
    }
}
