package com.qadr.ecommerce.ecommercecommon.service;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.MenuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class MenuService {
    @Autowired private MenuRepo repo;

    public Map<String, Object> getMenus(){
        Map<String, Object> map = new HashMap<>();
        map.put("header", repo.findByType(MenuType.HEADER_MENU));
        map.put("footer", repo.findByType(MenuType.FOOTER_MENU));
        return map;
    }

    public Menu getByAlias(String alias) {
        return repo.findByAliasAndEnabled(alias, true)
                .orElseThrow(() -> new CustomException(HttpStatus.BAD_REQUEST, "Could not find menu"));
    }
}
