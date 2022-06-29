package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.PayPalOrderResponse;
import com.qadr.ecommerce.sharedLibrary.entities.setting.EmailSettingBag;
import com.qadr.ecommerce.sharedLibrary.entities.setting.PaymentSettingBag;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class PayPalService {
    public static final String BASE_URL = "https://api.sandbox.paypal.com";
    public static final String GET_ORDER_API_URL = "/v2/checkout/orders/";
    @Autowired private SettingsService settingsService;

    public boolean validateOrder(String orderId){
        PayPalOrderResponse payPalOrderResponse = getOrderDetails(orderId);
        return payPalOrderResponse.validate(orderId);
    }

    public PayPalOrderResponse getOrderDetails(String orderId){
        PaymentSettingBag paymentSettingBag = settingsService.getPaymentSettingBag();
        String baseUrl = paymentSettingBag.getPaymentUrl();
        String url = baseUrl + GET_ORDER_API_URL+ orderId;
        String ClientId = paymentSettingBag.getPaymentId();
        String ClientSecret = paymentSettingBag.getPaymentSecret();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));
        httpHeaders.add("Accept-Language", "en_US");
        httpHeaders.setBasicAuth(ClientId, ClientSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(httpHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PayPalOrderResponse> response =
                restTemplate.exchange(url, HttpMethod.GET, request, PayPalOrderResponse.class);
        HttpStatus statusCode = response.getStatusCode();
        checkStatusCode(statusCode);

        return response.getBody();
    }

    private void checkStatusCode(HttpStatus statusCode) {
        if(!statusCode.equals(HttpStatus.OK)){
            String message = "";
            switch (statusCode) {
                case NOT_FOUND -> message = "Order ID not found";
                case INTERNAL_SERVER_ERROR -> message = "PayPal Server Error";
                case BAD_REQUEST -> message = "Bad Request to PayPal Checkout API";
                default -> message = "PayPal returned with an error";
            }
            throw new CustomException(statusCode, message);
        }
    }
}
