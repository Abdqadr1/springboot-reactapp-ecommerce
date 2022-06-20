package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.setting.Setting;
import com.qadr.ecommerce.sharedLibrary.entities.setting.SettingsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettingsRepo extends JpaRepository<Setting, String> {

    List<Setting> findByCategoryOrderByKeyAsc(SettingsCategory category);

    List<Setting> findByCategory(SettingsCategory category);

    @Query("SELECT s FROM Setting s WHERE s.category = ?1 OR s.category = ?2 ORDER BY s.key ASC")
    List<Setting> findByTwoCategories(SettingsCategory one, SettingsCategory two);


}
