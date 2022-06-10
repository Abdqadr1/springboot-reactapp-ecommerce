package com.qadr.ecommerce.ecommerceadmin.controllers;

import com.qadr.ecommerce.ecommerceadmin.export.CustomerCsvExporter;
import com.qadr.ecommerce.ecommerceadmin.service.CustomerService;
import com.qadr.ecommerce.sharedLibrary.entities.Country;
import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.State;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    public static final Logger LOGGER = LoggerFactory.getLogger(CustomerController.class);
    @Autowired
    private CustomerService customerService;

    @GetMapping("/countries")
    public List<Country> listCountries(){
        return customerService.getAllCountries();
    }

    @GetMapping("/states")
    public List<State> listStates(@RequestParam("id") Integer id){
        return customerService.getCountryStates(new Country(id));
    }


    @GetMapping
    public CustomCustomerPage listFirstPage(){
        return listByPage(1, "firstName", "asc", null);
    }

    @GetMapping("/page/{number}")
    public CustomCustomerPage listByPage(@PathVariable("number") Integer number,
                                         @RequestParam("sortField") String sortField,
                                         @RequestParam("dir") String dir,
                                         @RequestParam(value = "keyword", required = false) String keyword){

        Page<Customer> page = customerService.getPage(number, sortField, dir, keyword);
        int startCount = (number-1) * CustomerService.CUSTOMERS_PER_PAGE + 1;
        int endCount = CustomerService.CUSTOMERS_PER_PAGE * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;


        return new CustomCustomerPage(
                number, startCount, endCount, page.getTotalPages(),
                page.getTotalElements(), page.getContent(), CustomerService.CUSTOMERS_PER_PAGE
        );
    }

    @GetMapping("/{id}/enable/{status}")
    public String updateEnabled(@PathVariable("id") Integer id,
                                @PathVariable("status") boolean status){
        return customerService.updateStatus(id, status);
    }

    @PostMapping("/edit/{id}")
    public Customer editCategory(@Valid Customer customer, @PathVariable("id") Integer id) throws IOException {
        return customerService.editCustomer(id, customer);
    }

    @GetMapping("/delete/{id}")
    public Customer deleteCategory(@PathVariable("id") Integer id){
        return customerService.deleteCustomer(id);
    }

    @GetMapping("/export/csv")
    void exportCSV(HttpServletResponse response) throws IOException {
        List<Customer> customers = customerService.getAll();
        CustomerCsvExporter customerCsvExporter = new CustomerCsvExporter();
        customerCsvExporter.export(customers, response);
    }

}
@AllArgsConstructor
@Data
class CustomCustomerPage {
    Integer currentPage;
    Integer startCount;
    Integer endCount;
    Integer totalPages;
    Long totalElements;
    List<Customer> customers;
    Integer numberPerPage;
}
