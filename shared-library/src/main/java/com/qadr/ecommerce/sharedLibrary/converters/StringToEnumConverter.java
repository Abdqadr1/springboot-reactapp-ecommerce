package com.qadr.ecommerce.sharedLibrary.converters;

import com.qadr.ecommerce.sharedLibrary.entities.menu.MoveType;
import org.springframework.core.convert.converter.Converter;

public class StringToEnumConverter implements Converter<String, MoveType> {
    @Override
    public MoveType convert(String source) {
        System.out.println(source);
        try {
            return MoveType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
