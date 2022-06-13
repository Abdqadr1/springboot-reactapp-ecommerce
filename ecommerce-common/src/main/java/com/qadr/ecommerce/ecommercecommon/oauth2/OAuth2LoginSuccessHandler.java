package com.qadr.ecommerce.ecommercecommon.oauth2;

import com.qadr.ecommerce.ecommercecommon.config.AppConfig;
import com.qadr.ecommerce.ecommercecommon.model.CustomerDetails;
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
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Autowired private CustomerService customerService;
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

        CustomerDetails customerDetails = new CustomerDetails(customer);
        String accessToken = JWTUtil.createAccessToken(customerDetails, request.getServletPath());
        String refreshToken = JWTUtil.createRefreshToken(customerDetails);
        String firstName =  customer.getFirstName();
        String lastName = customer.getLastName();

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("firstName", firstName)
                .queryParam("lastName", lastName)
                .build().toUriString();
    }

    protected String determineUrlNoEmail(String url, String clientName){
        return UriComponentsBuilder.fromUriString(url)
                .queryParam("error", "No email return by "+clientName)
                .build().toUriString();
    }

    protected String getTargetUrl(HttpServletRequest request){
        Optional<String> redirectUri = CookieUtils.getCookie(request, OAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

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

}
