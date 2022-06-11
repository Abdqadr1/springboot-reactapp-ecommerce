package com.qadr.ecommerce.sharedLibrary.util;

public class CommonUtil {

    public static String getAppName(){
        return "E-commerce";
    }

    public static String toSnakeCase(String camelCase){
        char[] arr = camelCase.toCharArray();
        StringBuilder result = new StringBuilder();
        result.append(arr[0]);
        for(int i = 1; i < arr.length; i++){
            char ch = arr[i];
            if(Character.isUpperCase(ch)){
                result.append("_").append(ch);
            }else {
                result.append(ch);
            }
        }
        System.out.println(result);
        return result.toString().toLowerCase();
    }
}
