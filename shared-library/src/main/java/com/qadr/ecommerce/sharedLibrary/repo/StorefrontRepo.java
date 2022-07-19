package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StorefrontRepo extends JpaRepository<Storefront, Integer> {
    List<Storefront> findByType(StorefrontType type);

    List<Storefront> findByEnabled(boolean b, Sort sort);

    @Query("SELECT COALESCE(MAX(s.position), 0) FROM Storefront s")
    int findMaxPosition();

    Optional<Storefront> findByPosition(int position);

    @Modifying
    @Query("UPDATE Storefront a SET a.enabled=?2 WHERE a.id=?1")
    void updateEnabled(Integer id, boolean status);
}
