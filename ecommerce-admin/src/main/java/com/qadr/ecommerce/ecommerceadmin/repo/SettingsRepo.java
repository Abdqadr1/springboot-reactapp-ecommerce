package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.SettingsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingsRepo extends JpaRepository<Setting, String> {

    Optional<List<Setting>> findByCategoryOrderByKeyAsc(SettingsCategory category);

    @Query("SELECT s FROM Setting s WHERE s.category = ?1 OR s.category = ?2 ORDER BY s.key ASC")
    Optional<List<Setting>> findByTwoCategories(SettingsCategory one, SettingsCategory two);


}
