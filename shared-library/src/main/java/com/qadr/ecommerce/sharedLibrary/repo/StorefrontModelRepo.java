package com.qadr.ecommerce.sharedLibrary.repo;

import com.qadr.ecommerce.sharedLibrary.entities.storefront.Storefront;
import com.qadr.ecommerce.sharedLibrary.entities.storefront.StorefrontModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StorefrontModelRepo extends JpaRepository<StorefrontModel, Integer> {

    Optional<StorefrontModel> findByStorefrontAndPosition(Storefront storefront, Integer pos);

    @Query("SELECT COALESCE(MAX(s.position), 0) FROM StorefrontModel s")
    int findMaxPosition();
}
