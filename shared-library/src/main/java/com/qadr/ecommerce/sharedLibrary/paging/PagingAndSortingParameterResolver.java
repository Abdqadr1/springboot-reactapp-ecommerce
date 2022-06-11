package com.qadr.ecommerce.sharedLibrary.paging;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.servlet.http.HttpServletRequest;

public class PagingAndSortingParameterResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(PagingAndSortingParam.class) != null;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest nativeWebRequest, WebDataBinderFactory binderFactory) throws Exception {

        HttpServletRequest request = (HttpServletRequest) nativeWebRequest.getNativeRequest();
        String sortField  = request.getParameter("sortField");
        String dir = request.getParameter("dir");
        String keyword = request.getParameter("keyword");
        String catId = request.getParameter("category");

        PagingAndSortingParam parameterAnnotation = parameter.getParameterAnnotation(PagingAndSortingParam.class);

        return new PagingAndSortingHelper(parameterAnnotation.name(), sortField, dir, keyword, catId);
    }
}
