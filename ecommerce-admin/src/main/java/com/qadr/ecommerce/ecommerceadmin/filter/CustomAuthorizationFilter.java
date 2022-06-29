package com.qadr.ecommerce.ecommerceadmin.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.util.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class CustomAuthorizationFilter extends OncePerRequestFilter {


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader(AUTHORIZATION);
        if(token != null  && token.startsWith("Bearer ")){
            try{
                String accessToken = token.substring("Bearer ".length());
                DecodedJWT decodedJWT = JWTUtil.verifyToken(accessToken);
                String email = decodedJWT.getSubject();
                String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                List<SimpleGrantedAuthority> authorities = Arrays.stream(roles)
                        .map(SimpleGrantedAuthority::new).collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                filterChain.doFilter(request, response);

            }catch (Exception e){
                response.setStatus(HttpStatus.BAD_REQUEST.value());
                Map<String, Object> ret = new HashMap<>();
                ret.put("message", e.getMessage());
                new ObjectMapper().writeValue(response.getOutputStream(), ret);
            }
        } else{
            filterChain.doFilter(request, response);
        }

    }

    String[] urls = {"/login", "/user-photos/", "/user/export/", "/category-photos/","/category/export/","/customer/export/",
            "/brand-photos/", "/brand/export", "/product-images/", "/product/export/", "/site-logo/", "/set/get",
            "/countries/list", "/states/get"};

    Predicate<String> isPermitted = path -> Arrays.stream(urls).anyMatch(path::startsWith);
}
