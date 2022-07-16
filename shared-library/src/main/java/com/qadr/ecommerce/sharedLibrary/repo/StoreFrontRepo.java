package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StoreFrontType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreFrontRepo extends JpaRepository<StoreFront, Integer> {
    List<StoreFront> findByType(StoreFrontType type);

    List<StoreFront> findByEnabled(boolean b);

    @Query("SELECT COALESCE(MAX(s.position), 0) FROM StoreFront s")
    int findMaxPosition();

    @Modifying
    @Query("UPDATE StoreFront a SET a.enabled=?2 WHERE a.id=?1")
    void updateEnabled(Integer id, boolean status);
}
