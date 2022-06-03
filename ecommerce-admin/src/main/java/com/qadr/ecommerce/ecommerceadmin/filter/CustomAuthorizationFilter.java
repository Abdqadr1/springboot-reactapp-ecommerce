package com.qadr.ecommerceadmin.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.ecommerceadmin.errors.CustomException;
import com.qadr.sharedLibrary.util.JWTUtil;
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(!isPermitted.test(request.getServletPath())){
            try{
                String authHeader = Optional.ofNullable(request.getHeader(AUTHORIZATION))
                        .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Authorization header is missing"));
                String accessToken = authHeader.substring("Bearer ".length());
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

    String[] urls = {"/login", "/user-photos/", "/user/export/", "/category-photos/","/category/export/",
            "/brand-photos/", "/brand/export", "/product-images/", "/product/export/"};

    Predicate<String> isPermitted = path -> Arrays.stream(urls).anyMatch(path::startsWith);
}
