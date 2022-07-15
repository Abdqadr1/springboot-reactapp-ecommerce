package com.qadr.ecommerce.ecommerceadmin.config;

import com.qadr.ecommerce.sharedLibrary.converters.StringToEnumConverter;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingParameterResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//
//        exposeResources(registry, "user-photos");
//        exposeResources(registry, "category-photos");
//        exposeResources(registry, "brand-photos");
//        exposeResources(registry, "product-images");
//        exposeResources(registry, "site-logo");
//
//    }
//
//    void exposeResources(ResourceHandlerRegistry registry, String dir){
//        Path path = Paths.get(dir);
//        String absolutePath = path.toFile().getAbsolutePath();
//        String logicalPath = dir.replace("../", "") + "/**";
//
////        System.out.printf("\n dir = %s, logical = %s, absolute %s \n", dir, logicalPath, absolutePath);
//
//        registry.addResourceHandler(
//                        "/"+logicalPath+"/**")
//                .addResourceLocations(
//                        "file:/"+absolutePath+"/");
//    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new PagingAndSortingParameterResolver());
    }
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToEnumConverter());
    }
}
