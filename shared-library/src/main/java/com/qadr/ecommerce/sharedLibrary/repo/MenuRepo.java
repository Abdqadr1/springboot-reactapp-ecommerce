package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuRepo extends JpaRepository<Menu, Integer> {
    Optional<Menu> findByAlias(String alias);

    Optional<Menu> findByTitle(String title);

    @Query("SELECT COALESCE(MAX(m.position), 0) FROM Menu m WHERE m.type=?1")
    int findMaxPositionForType(MenuType type);
}
