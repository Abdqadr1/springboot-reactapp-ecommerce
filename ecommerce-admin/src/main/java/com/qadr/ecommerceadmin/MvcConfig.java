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
        String userDir = "user-photos";
        Path userPath = Paths.get(userDir);
        String absolutePath = userPath.toFile().getAbsolutePath();
        String categoryDir = "category-photos";
        Path categoryPath = Paths.get(categoryDir);
        String cAbsolutePath = categoryPath.toFile().getAbsolutePath();

        String brandDir = "brand-photos";
        Path brandPath = Paths.get(brandDir);
        String bAbsolutePath = brandPath.toFile().getAbsolutePath();


        registry.addResourceHandler(
                "/"+userDir+"/**",
                        "/"+categoryDir+"/**",
                        "/"+brandDir+"/**")
                .addResourceLocations(
                        "file:/"+absolutePath+"/",
                        "file:/"+cAbsolutePath+"/",
                        "file:/"+bAbsolutePath+"/");
    }


}
