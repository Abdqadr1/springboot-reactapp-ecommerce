package com.qadr.ecommerceadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class EcommerceAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceAdminApplication.class, args);
	}


	@Bean
	BCryptPasswordEncoder bCryptPasswordEncoder (){
		return new BCryptPasswordEncoder();
	}
}
