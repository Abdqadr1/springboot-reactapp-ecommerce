package com.qadr.ecommerce.ecommercecommon.repo;

import com.qadr.ecommerce.sharedLibrary.entities.Address;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Integer> {

    List<Address> findByCustomer(Customer customer);

    Optional<Address> findByIdAndCustomer(Integer integer, Customer customer);

    @Modifying
    @Query("DELETE FROM Address a WHERE a.id =?1 AND a.customer.id=?2")
    void deleteByIdAndCustomer(Integer integer, Integer customerId);

    @Query("SELECT a FROM Address a WHERE a.defaultAddress=true AND a.customer.id=?1")
    Optional<Address> findDefaultAddressByCustomer(Integer customerId);

}
