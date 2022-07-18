package com.qadr.ecommerce.ecommerceadmin.service;

import com.qadr.ecommerce.ecommerceadmin.repo.BrandRepo;
import com.qadr.ecommerce.ecommerceadmin.repo.CategoryRepo;
import com.qadr.ecommerce.sharedLibrary.entities.Brand;
import com.qadr.ecommerce.sharedLibrary.entities.Category;
import com.qadr.ecommerce.sharedLibrary.entities.article.Article;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MoveType;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontModel;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontType;
import com.qadr.ecommerce.sharedLibrary.errors.CustomException;
import com.qadr.ecommerce.sharedLibrary.repo.ArticleRepo;
import com.qadr.ecommerce.sharedLibrary.repo.ProductRepo;
import com.qadr.ecommerce.sharedLibrary.repo.StorefrontRepo;
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
    @Autowired private StorefrontRepo repo;
    @Autowired private ProductRepo productRepo;
    @Autowired private CategoryRepo categoryRepo;
    @Autowired private ArticleRepo articleRepo;
    @Autowired private BrandRepo brandRepo;

    public Storefront saveNewStoreFront(Storefront storeFront){
        int maxPosition = repo.findMaxPosition() + 1;
        validate(storeFront);
        storeFront.setPosition(maxPosition);
        Storefront save = repo.save(storeFront);
        save.getModels().forEach(this::add);
        return save;
    }

    public Storefront editStoreFront(Storefront storeFront){
        Storefront storeFrontInDb = get(storeFront.getId());
        storeFront.setPosition(storeFrontInDb.getPosition());
        storeFront.setType(storeFrontInDb.getType());
        Storefront save = repo.save(storeFront);
        save.getModels().forEach(this::add);
        return save;
    }

    private void validate(Storefront storeFront){
        if(storeFront.getType().equals(StorefrontType.ALL_CATEGORIES)){
            List<Storefront> byType = repo.findByType(storeFront.getType());
            if(!byType.isEmpty()) throw new CustomException(HttpStatus.BAD_REQUEST, storeFront.getType() + " section can only exist once");
        }
    }

    private void add(StorefrontModel save){
        StorefrontType type = save.getType();
        if(type.equals(StorefrontType.BRAND)){
            brandRepo.findById(save.getBrand().getId()).ifPresent(save::setBrand);
        }
        if(type.equals(StorefrontType.CATEGORY)){
            categoryRepo.findById(save.getCategory().getId()).ifPresent(save::setCategory);
        }
        if(type.equals(StorefrontType.ARTICLE)){
            articleRepo.findById(save.getArticle().getId()).ifPresent(save::setArticle);
        }
        if(type.equals(StorefrontType.PRODUCT)){
            productRepo.findById(save.getProduct().getId()).ifPresent(save::setProduct);
        }
    }



    public List<Storefront> getAll(){
        return repo.findAll(Sort.by("position").descending());
    }
    public List<Storefront> movePosition(Integer id, MoveType moveType){
        Storefront storeFront = get(id);
        int oldPosition = storeFront.getPosition();
        int newPosition = (moveType.equals(MoveType.DOWN))
                ? storeFront.getPosition() + 1 : storeFront.getPosition() - 1;
        if(newPosition < 1){
            throw new CustomException(HttpStatus.BAD_REQUEST, "You can not move below position 1");
        }
        Optional<Storefront> byTypeAndPosition = repo.findByPosition(newPosition);
        if(byTypeAndPosition.isPresent()){
            move(storeFront, moveType, newPosition);
            Storefront storeFront1 = byTypeAndPosition.get();
            storeFront1.setPosition(oldPosition);
            return repo.saveAll(List.of(storeFront, storeFront1));
        }else {
            move(storeFront, moveType, newPosition);
            Storefront save = repo.save(storeFront);
            return List.of(save);
        }
    }

    private void move(Storefront storeFront, MoveType moveType, int newPosition){
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

    private Storefront get(Integer id){
        return  repo.findById(id)
                .orElseThrow(()-> new CustomException(HttpStatus.BAD_REQUEST, "Could not find storefront"));
    }

    public void validateMenuUniqueProps(Storefront front, Integer id){
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
