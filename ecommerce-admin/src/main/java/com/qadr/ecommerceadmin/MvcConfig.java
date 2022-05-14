package com.qadr.ecommerceadmin;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String dir = "user-photos";
        Path path = Paths.get(dir);
        String absolutePath = path.toFile().getAbsolutePath();
        registry.addResourceHandler("/"+dir+"/**")
                .addResourceLocations("file:/"+absolutePath+"/");
    }


}
