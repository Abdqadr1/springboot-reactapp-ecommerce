package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MoveType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.MenuRepo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.*;

@Service
@Transactional
public class MenuService {
    @Autowired private MenuRepo repo;

    public Menu saveMenu(Menu menu){
        if(menu.getAlias().isBlank()){
            menu.setAlias(menu.getTitle().replaceAll(" ", "_"));
        }
        int maxPositionForType = repo.findMaxPositionForType(menu.getType());
        menu.setPosition(++maxPositionForType);
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
            menu.setPosition(menuInDb.getPosition());
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

    public List<Menu> getAll() {
        return repo.findAll();
    }

    public List<Menu> movePosition(MoveDTO moveDTO){
        Menu menu = get(moveDTO.getId());
        int oldPosition = menu.getPosition();
        int newPosition = (moveDTO.getMoveType().equals(MoveType.DOWN))
                ? menu.getPosition() + 1 : menu.getPosition() - 1;
        if(newPosition < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can not move a menu below 1");
        }
        Optional<Menu> byTypeAndPosition = repo.findByTypeAndPosition(moveDTO.getMenuType(), newPosition);
        if(byTypeAndPosition.isPresent()){
            move(menu, moveDTO, newPosition);
            Menu menu1 = byTypeAndPosition.get();
            menu1.setPosition(oldPosition);
            return repo.saveAll(List.of(menu, menu1));
        }else {
            move(menu, moveDTO, newPosition);
            Menu save = repo.save(menu);
            return List.of(save);
        }
    }
    private void move(Menu menu, MoveDTO moveDTO, int newPosition){
        if (moveDTO.getMoveType().equals(MoveType.DOWN)) {
            menu.moveDown();
        } else if(moveDTO.getMoveType().equals(MoveType.UP)) {
            menu.moveUp();
        } else{
            throw new CustomException(HttpStatus.BAD_REQUEST, "Does not recognize action");
        }
        if(newPosition < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can not move a menu below 1");
        }
    }

    public void validateMenuUniqueProps(Menu menu, Integer id){
//        Optional<Menu> byTitle = repo.findByTitle(menu.getTitle());
//        if (byTitle.isPresent() && !byTitle.get().getId().equals(id)){
//            throw new CustomException(HttpStatus.BAD_REQUEST, "Title already exists");
//        }
//        Optional<Menu> byAlias = repo.findByAlias(menu.getAlias());
//        if (byAlias.isPresent() && !byAlias.get().getId().equals(id)){
//            throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");
//        }
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

    @RequiredArgsConstructor
    @AllArgsConstructor
    @Data
    public static class MoveDTO {
        @NotNull(message = "Invalid parameters")
        private Integer id;
        @NotNull(message = "Invalid parameters")
        private MenuType menuType;
        @NotNull(message = "Invalid parameters")
        private MoveType moveType;
    }

}
