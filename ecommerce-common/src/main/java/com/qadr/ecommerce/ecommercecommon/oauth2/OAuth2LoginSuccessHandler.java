package com.qadr.ecommerce.ecommercecommon.oauth2;

import com.qadr.ecommerce.ecommercecommon.config.AppConfig;
import com.qadr.ecommerce.ecommercecommon.model.CustomerDetails;
import com.qadr.ecommerce.ecommercecommon.service.CartService;
import com.qadr.ecommerce.ecommercecommon.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.AuthType;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.*;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Autowired private CustomerService customerService;
    @Autowired private CartService cartService;
    @Autowired private AppConfig appConfig;
    @Autowired private OAuth2AuthorizationRequestRepository oAuth2AuthorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        String countryCode = request.getLocale().getCountry();
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String name = oAuth2User.getName();
        String email = oAuth2User.getEmail();
        String targetUrl;
        if(email == null || email.isBlank()){
            targetUrl = determineUrlNoEmail(getTargetUrl(request), oAuth2User.getClientName());
        }else {
            Optional<Customer> customerByEmail = customerService.getByEmail(email);
            Customer customer;
            if(customerByEmail.isPresent()){
                customer = customerByEmail.get();
                customerService.changeAuthType(customer.getId(), AuthType.valueOf(oAuth2User.getClientName().toUpperCase()));
            }else {
                customer = customerService.createCustomerFromOAuth(name, email, countryCode, AuthType.valueOf(oAuth2User.getClientName().toUpperCase()));
            }
            targetUrl = determineUrl(request, getTargetUrl(request), customer);
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }

    protected String determineUrl(HttpServletRequest request, String targetUrl, Customer customer) {
        Map<String, String> map = new HashMap<>();
        CustomerDetails customerDetails = new CustomerDetails(customer);
        map.put("accessToken", JWTUtil.createAccessToken(customerDetails, request.getServletPath()));
        map.put("refreshToken", JWTUtil.createRefreshToken(customerDetails));
        map.put("firstName", customer.getFirstName());
        map.put("lastName", customer.getLastName());


        String uriString = buildUriString(targetUrl, map);
        System.out.println(uriString);
        return uriString;
    }

    protected String determineUrlNoEmail(String url, String clientName){
        Map<String, String> map = new HashMap<>();
        map.put("error", "No email return by "+clientName);
        return buildUriString(url, map);
    }

    protected String getTargetUrl(HttpServletRequest request){
        Optional<String> redirectUri = CookieUtils.getCookie(request, OAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
        System.out.println(redirectUri.get());
        if(redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new CustomException(
                    HttpStatus.BAD_REQUEST,
                    "Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }
        return  redirectUri.orElse(getDefaultTargetUrl());
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        oAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);

        return appConfig.getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    // Only validate host and port. Let the clients use different paths if they want to
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    if(authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                        return true;
                    }
                    return false;
                });
    }

    private String buildUriString(String url, Map<String, String> variables){
        url = url + "?";
        StringBuilder urlBuilder = new StringBuilder(url);
        List<String> keySet =  new ArrayList<>(variables.keySet());
        for (int i = 0; i < keySet.size(); i++) {
            String var = (i == 0) ? "" : "&";
            String key = keySet.get(i);
            var +=  key+"="+variables.get(key);
            urlBuilder.append(var);
        } ;
        return urlBuilder.toString();
    }


}
