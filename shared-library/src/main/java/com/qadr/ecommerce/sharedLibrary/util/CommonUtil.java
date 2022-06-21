package com.qadr.ecommerce.sharedLibrary.util;

import com.qadr.ecommerce.sharedLibrary.entities.setting.CurrencySettingBag;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

public class CommonUtil {

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

    public static String formatCurrency(float amount, CurrencySettingBag settingBag){
        String symbol = settingBag.getCurrencySymbol();
        Integer decimalDigit = settingBag.getDecimalDigit();
        System.out.println(amount);

        String pattern = settingBag.getSymbolPosition().startsWith("BEFORE") ? symbol : "";
        pattern += "###,###";
        if(decimalDigit > 0){
            pattern += ".";
            pattern += "#".repeat(decimalDigit);
        }
        pattern += settingBag.getSymbolPosition().startsWith("AFTER") ? symbol : "";

        char decimalPointType = Objects.equals(settingBag.getDecimalPointType(), "COMMA") ? ',' : '.';
        char thousandPointType = Objects.equals(settingBag.getThousandType(), "COMMA") ? ',' : '.';

        DecimalFormatSymbols decimalFormatSymbols = DecimalFormatSymbols.getInstance();
        decimalFormatSymbols.setDecimalSeparator(decimalPointType);
        decimalFormatSymbols.setGroupingSeparator(thousandPointType);
        DecimalFormat formatter = new DecimalFormat(pattern);
        formatter.setDecimalFormatSymbols(decimalFormatSymbols);

        return formatter.format(amount);
    }

    public static String dateFormatter(Date date){
        DateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy");
        return dateFormatter.format(date);
    }
}
