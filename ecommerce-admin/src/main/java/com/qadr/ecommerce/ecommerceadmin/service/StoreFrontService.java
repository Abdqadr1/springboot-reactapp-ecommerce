package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MoveType;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFrontType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.StoreFrontRepo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StoreFrontService {
    @Autowired private StoreFrontRepo repo;

    public StoreFront saveNewStoreFront(StoreFront storeFront){
        int maxPosition = repo.findMaxPosition() + 1;
        validate(storeFront);
        storeFront.setPosition(maxPosition);
        return repo.save(storeFront);
    }

    public StoreFront editStoreFront(StoreFront storeFront){
        StoreFront storeFrontInDb = get(storeFront.getId());
        storeFront.setPosition(storeFrontInDb.getPosition());
        storeFront.setType(storeFrontInDb.getType());
        return repo.save(storeFront);
    }

    private void validate(StoreFront storeFront){
        if(storeFront.getType().equals(StoreFrontType.ALL_CATEGORIES)){
            List<StoreFront> byType = repo.findByType(storeFront.getType());
            if(!byType.isEmpty()) throw new CustomException(HttpStatus.BAD_REQUEST, storeFront.getType() + " section can only exist once");
        }
    }



    public List<StoreFront> getAll(){
        return repo.findAll(Sort.by("position").descending());
    }
    public List<StoreFront> movePosition(Integer id, MoveType moveType){
        StoreFront storeFront = get(id);
        int oldPosition = storeFront.getPosition();
        int newPosition = (moveType.equals(MoveType.DOWN))
                ? storeFront.getPosition() + 1 : storeFront.getPosition() - 1;
        if(newPosition < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can not move below position 1");
        }
        Optional<StoreFront> byTypeAndPosition = repo.findByPosition(newPosition);
        if(byTypeAndPosition.isPresent()){
            move(storeFront, moveType, newPosition);
            StoreFront storeFront1 = byTypeAndPosition.get();
            storeFront1.setPosition(oldPosition);
            return repo.saveAll(List.of(storeFront, storeFront1));
        }else {
            move(storeFront, moveType, newPosition);
            StoreFront save = repo.save(storeFront);
            return List.of(save);
        }
    }

    private void move(StoreFront storeFront, MoveType moveType, int newPosition){
        if (moveType.equals(MoveType.DOWN)) {
            storeFront.moveDown();
        } else if(moveType.equals(MoveType.UP)) {
            storeFront.moveUp();
        } else{
            throw new CustomException(HttpStatus.BAD_REQUEST, "Does not recognize action");
        }
        if(newPosition < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can not move a storeFront below 1");
        }
    }

    public void deleteStorefront(Integer id) {
        get(id);
        repo.deleteById(id);
    }

    public void updateEnabled(Integer id, boolean status) {
        get(id);
        repo.updateEnabled(id, status);
    }

    private StoreFront get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find storefront"));
    }

    public void validateMenuUniqueProps(StoreFront front, Integer id){
//        Optional<Menu> byTitle = repo.findByTitle(menu.getTitle());
//        if (byTitle.isPresent() && !byTitle.get().getId().equals(id)){
//            throw new CustomException(HttpStatus.BAD_REQUEST, "Title already exists");
//        }
//        Optional<Menu> byAlias = repo.findByAlias(menu.getAlias());
//        if (byAlias.isPresent() && !byAlias.get().getId().equals(id)){
//            throw new CustomException(HttpStatus.BAD_REQUEST, "Alias already exists");
//        }
//        Optional<Menu> byTypeAndPosition = repo.findByTypeAndPosition(menu.getType(), menu.getPosition());
//        if (byTypeAndPosition.isPresent() && !byTypeAndPosition.get().getId().equals(id)){
//            throw new CustomException(HttpStatus.BAD_REQUEST, "There's already a menu in that position");
//        }
    }

    @RequiredArgsConstructor
    @AllArgsConstructor
    @Data
    public static class MoveDTO {
        @NotNull(message = "Invalid parameters")
        private Integer id;
        @NotNull(message = "Invalid parameters")
        private MoveType moveType;
    }

}
