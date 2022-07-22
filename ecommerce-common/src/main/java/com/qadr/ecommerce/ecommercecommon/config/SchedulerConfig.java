package com.qadr.ecommerce.ecommercecommon.config;

import com.qadr.ecommerce.sharedLibrary.entities.Constants;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@EnableScheduling
@Configuration
public class SchedulerConfig {
    public static final Logger LOGGER = LoggerFactory.getLogger(SchedulerConfig.class);

    @Scheduled(fixedDelay = 300000, initialDelay = 5000, zone = "Africa/Lagos")
    public void pingSelf(){
        String url = """
                %s/customer/countries
                """.formatted(Constants.ECOMMERCE_URL);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setAccept(List.of(MediaType.APPLICATION_JSON));
        httpHeaders.add("Accept-Language", "en_US");
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(httpHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Country[]> response =
                restTemplate.exchange(url, HttpMethod.GET, request, Country[].class);
        if(!response.getStatusCode().equals(HttpStatus.OK)){
            LOGGER.error("Could not ping self");
        }
    }
}
