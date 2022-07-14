package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.paging.PagingAndSortingHelper;
import com.qadr.ecommerce.sharedLibrary.repo.MenuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class MenuService {
    public static final int MENUS_PER_PAGE = 5;
    @Autowired private MenuRepo repo;

    public Menu saveMenu(Menu menu){
        if(menu.getAlias().isBlank()){
            menu.setAlias(menu.getTitle().replaceAll(" ", "_"));
        }
        validateMenuUniqueProps(menu, null);
        return repo.save(menu);
    }
    public Menu editMenu(Menu menu){
        if (menu.getId() != null){
            Menu menuInDb = get(menu.getId());
            validateMenuUniqueProps(menu, menu.getId());
            if(menu.getAlias().isBlank()){
                menu.setAlias(menuInDb.getAlias());
            }
            return repo.save(menu);
        }else throw new CustomException(HttpStatus.BAD_REQUEST, "Invalid request");
    }

    public void deleteMenu(Integer id) {
        get(id);
        repo.deleteById(id);
    }

    public void updateStatus(Integer id, boolean status) {
        get(id);
        repo.updateStatus(id, status);
    }

    public Map<String, Object> getPage(Integer number) {
        Sort sort = Sort.by("type").ascending().and(Sort.by("position").ascending());
        PageRequest pageable = PageRequest.of(number - 1, MENUS_PER_PAGE, sort);
        Page<Menu> all = repo.findAll(pageable);
        return mapInfo(number, MENUS_PER_PAGE, all);
    }

    public void validateMenuUniqueProps(Menu menu, Integer id){
        Optional<Menu> byTitle = repo.findByTitle(menu.getTitle());
        if (byTitle.isPresent() && !byTitle.get().getId().equals(id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Title already exists");
        }
        Optional<Menu> byAlias = repo.findByAlias(menu.getAlias());
        if (byAlias.isPresent() && !byAlias.get().getId().equals(id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");
        }
        Optional<Menu> byTypeAndPosition = repo.findByTypeAndPosition(menu.getType(), menu.getPosition());
        if (byTypeAndPosition.isPresent() && !byTypeAndPosition.get().getId().equals(id)){
            throw new CustomException(HttpStatus.BAD_REQUEST, "There's already a menu in that position");
        }
    }

    private Map<String, Object> mapInfo(Integer number, Integer pageSze, Page<?> page){
        int startCount = (number-1) * pageSze + 1;
        int endCount = pageSze * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;
        Map<String, Object> pageInfo = new HashMap<>();
        pageInfo.put("currentPage", number);
        pageInfo.put("startCount", startCount);
        pageInfo.put("endCount", endCount);
        pageInfo.put("totalPages", page.getTotalPages());
        pageInfo.put("totalElements", page.getTotalElements());
        pageInfo.put("menus", page.getContent());
        pageInfo.put("numberPerPage", pageSze);
        return pageInfo;
    }

    private Menu get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find menu"));
    }

}
