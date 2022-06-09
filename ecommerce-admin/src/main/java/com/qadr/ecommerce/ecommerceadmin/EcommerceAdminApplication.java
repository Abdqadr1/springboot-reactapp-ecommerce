package com.qadr.ecommerce.ecommerceadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication(scanBasePackages = {"com.qadr.sharedLibrary.*","com.qadr.ecommerce.ecommerceadmin.*"})
@EntityScan({"com.qadr.ecommerce.sharedLibrary.*","com.qadr.ecommerce.ecommerceadmin.*"})
@EnableJpaRepositories({"com.qadr.ecommerce.sharedLibrary.*","com.qadr.ecommerce.ecommerceadmin.*"})
public class EcommerceAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceAdminApplication.class, args);
	}


	@Bean
	BCryptPasswordEncoder bCryptPasswordEncoder (){
		return new BCryptPasswordEncoder();
	}
}
