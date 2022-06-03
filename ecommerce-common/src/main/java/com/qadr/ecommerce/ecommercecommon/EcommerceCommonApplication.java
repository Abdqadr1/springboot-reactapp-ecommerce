package com.qadr.ecommercecommon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan({"com.qadr.ecommerce-website.*"})
public class EcommerceCommonApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceCommonApplication.class, args);
	}

}
