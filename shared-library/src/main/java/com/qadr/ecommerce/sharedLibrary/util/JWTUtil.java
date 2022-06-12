package com.qadr.ecommerce.sharedLibrary.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.stream.Collectors;

public class JWTUtil {
    private static final Algorithm algorithm = Algorithm.HMAC256("my_secret_key".getBytes());
    public static String createAccessToken (UserDetails details, String path){
        JWTCreator.Builder builder = JWT.create()
                .withSubject(details.getUsername())
                .withIssuer(path)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 30 * 60 * 1000));
        if(details.getAuthorities() != null && details.getAuthorities().size() > 0){
            builder.withClaim("roles",
                    details.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        }
        return builder.sign(algorithm);
    }

    public static String createRefreshToken (UserDetails details){
        JWTCreator.Builder builder = JWT.create()
                .withSubject(details.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));
        if(details.getAuthorities() != null && details.getAuthorities().size() > 0){
            builder.withClaim("roles",
                    details.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        }
        return builder.sign(algorithm);
    }

    public static DecodedJWT verifyToken(String token){
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }


}
