package com.qadr.ecommerce.ecommercecommon.filter;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.util.JWTUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.time.LocalDateTime;
import java.util.*;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

public class CustomAuthorizationFilter extends OncePerRequestFilter {
    public static final Logger LOGGER = LoggerFactory.getLogger(CustomAuthorizationFilter.class);
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Optional<String> headerOptional = Optional.ofNullable(request.getHeader(AUTHORIZATION));
        if(headerOptional.isPresent()){
            try{
                String authHeader = headerOptional.get();
                String accessToken = authHeader.substring("Bearer ".length());
                DecodedJWT decodedJWT = JWTUtil.verifyToken(accessToken);
                String email = decodedJWT.getSubject();

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(email, null, null);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                filterChain.doFilter(request, response);

            }catch (Exception e){
                if(e instanceof TokenExpiredException &&
                        request.getServletPath().equals("/checkout/paypal_order")){
                    String token = request.getHeader("refreshToken");
                    if(token != null && !token.isBlank()){
                        DecodedJWT decodedJWT = JWTUtil.verifyToken(token);
                        String email = decodedJWT.getSubject();
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(email, null, null);
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        try {
                            filterChain.doFilter(request, response);
                        } catch (IOException | ServletException ex) {
                            LOGGER.error("PayPal Order Page", ex);
                            doReturn(response, ex);
                        }
                    }else {
                        doReturn(response, e);
                    }
                }else{
                    doReturn(response, e);
                }
            }
        }else {
            filterChain.doFilter(request, response);
        }

    }
    public void doReturn(HttpServletResponse response, Exception e) throws IOException {
        LOGGER.error(e.getMessage());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        Map<String, Object> ret = new HashMap<>();
        ret.put("message", e.getMessage());
        ret.put("timestamp", LocalDateTime.now().toString());
        new ObjectMapper().writeValue(response.getOutputStream(), ret);
    }
}
