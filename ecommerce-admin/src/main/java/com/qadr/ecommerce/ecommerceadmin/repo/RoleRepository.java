package com.qadr.ecommerce.ecommerceadmin.repo;

import com.qadr.ecommerce.ecommerceadmin.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

}
