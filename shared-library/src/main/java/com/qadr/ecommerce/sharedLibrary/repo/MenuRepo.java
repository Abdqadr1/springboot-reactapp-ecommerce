package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.menu.Menu;
import com.qadr.ecommerce.sharedLibrary.entities.menu.MenuType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepo extends JpaRepository<Menu, Integer> {
    Optional<Menu> findByAlias(String alias);

    Optional<Menu> findByTitle(String title);

    @Query("SELECT m FROM Menu m WHERE m.type =?1 AND m.enabled = true ORDER BY m.position ASC")
    List<Menu> findByType(MenuType type);

    Optional<Menu> findByTypeAndPosition(MenuType type, Integer position);

    @Query("SELECT COALESCE(MAX(m.position), 0) FROM Menu m WHERE m.type=?1")
    int findMaxPositionForType(MenuType type);

    @Modifying
    @Query("UPDATE Menu a SET a.enabled=?2 WHERE a.id=?1")
    void updateStatus(Integer id, boolean status);

    Optional<Menu> findByAliasAndEnabled(String alias, boolean b);
}
