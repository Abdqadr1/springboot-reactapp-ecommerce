package com.qadr.ecommerce.ecommercecommon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(scanBasePackages = {"com.qadr.ecommerce.ecommercecommon.*",
		"com.qadr.ecommerce.sharedLibrary.*"})
@EntityScan({"com.qadr.ecommerce.sharedLibrary.*","com.qadr.ecommerce.ecommercecommon.*"})
@EnableJpaRepositories({"com.qadr.ecommerce.sharedLibrary.*","com.qadr.ecommerce.ecommercecommon.*"})
public class EcommerceCommonApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcommerceCommonApplication.class, args);
	}


	@Bean
	PasswordEncoder encoder(){
		return new BCryptPasswordEncoder();
	}
}
