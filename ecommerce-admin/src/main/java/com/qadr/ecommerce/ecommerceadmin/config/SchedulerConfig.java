package com.qadr.ecommerce.ecommerceadmin.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@EnableScheduling
public class SchedulerConfig {
    @Autowired RestTemplate restTemplate;
}
