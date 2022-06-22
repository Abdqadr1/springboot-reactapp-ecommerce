package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.ecommercecommon.model.PayPalOrderResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;


import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class PayPalServiceTest {
    public static final String BASE_URL = "https://api.sandbox.paypal.com";
    public static final String GET_ORDER_API_URL = "/v2/checkout/orders/";
    public static final String CLIENT_ID = "";
    public static final String CLIENT_SECRET = "";

    @Test
    void testGetOrderDetails(){
        String orderID = "8SM75119M6200372U";
        String url = BASE_URL + GET_ORDER_API_URL+ orderID;

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));
        httpHeaders.add("Accept-Language", "en_US");
        httpHeaders.setBasicAuth(CLIENT_ID, CLIENT_SECRET);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(httpHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PayPalOrderResponse> response = restTemplate.exchange(url, HttpMethod.GET, request, PayPalOrderResponse.class);
        PayPalOrderResponse payPalOrderResponse = response.getBody();
        assert payPalOrderResponse != null;
        assertThat(payPalOrderResponse.validate(orderID)).isTrue();
        System.out.println(payPalOrderResponse);
    }

}