package com.qadr.ecommerce.ecommerceadmin.config;

import com.qadr.ecommerce.ecommerceadmin.filter.CustomAuthorizationFilter;
import com.qadr.ecommerce.ecommerceadmin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserService userService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors().configurationSource(request -> {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("*"));
            configuration.setAllowedMethods(List.of("*"));
            configuration.setAllowedHeaders(List.of("*"));
            return configuration;
        });

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests().antMatchers( "/login/**", "/set/get").permitAll();

        http.authorizeRequests().antMatchers(
                "/user/export/**","/category/export/**","/brand/export/**", "/brand-photos/**",
                "/customer/export/**","/user-photos/**","/category-photos/**", "/product-images/**",
                "/product/export/**","/site-logo/**", "/set/get","/countries/list", "/states/get").permitAll();

        http.authorizeRequests().antMatchers("/category/get-hierarchy/**")
                .hasAnyAuthority("Admin", "Editor", "Salesperson", "Shipper");

        http.authorizeRequests().antMatchers("/product/delete/**", "/product/add/**" )
                .hasAnyAuthority("Admin", "Editor");

        http.authorizeRequests().antMatchers("/review/**")
                        .hasAnyAuthority("Admin", "Assistant");

        http.authorizeRequests().antMatchers("/product/{id:[\\d+]}/**", "/product/edit/**")
                .hasAnyAuthority("Admin", "Editor", "Salesperson");

        http.authorizeRequests().antMatchers("/product/**")
                .hasAnyAuthority("Admin", "Editor", "Salesperson", "Shipper");

        http.authorizeRequests().antMatchers("/user/**").hasAuthority("Admin");

        http.authorizeRequests().antMatchers("/category/**","/brand/**")
                .hasAnyAuthority("Admin", "Editor");


        http.authorizeRequests().antMatchers("/orders/page/**")
                .hasAnyAuthority("Admin", "Salesperson", "Shipper");

        http.authorizeRequests().antMatchers("/orders/update_status/**")
                .hasAnyAuthority("Shipper");

        http.authorizeRequests().antMatchers("/customer/countries")
                .hasAnyAuthority("Assistant");

        http.authorizeRequests().antMatchers("/customer/**", "/shipping_rate", "/orders/**", "/sales_report/**")
                .hasAnyAuthority("Admin", "Salesperson");


        http.authorizeRequests().antMatchers("/set/**", "/countries/**", "/states/**").hasAuthority("Admin");

        http.authorizeRequests().anyRequest().permitAll();

        http.formLogin().disable();

        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    public DaoAuthenticationProvider authenticationProvider () {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
