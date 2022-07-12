package com.qadr.ecommerce.sharedLibrary.paging;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.entities.question.Question;
import com.qadr.ecommerce.sharedLibrary.entities.review.Review;
import com.qadr.ecommerce.sharedLibrary.entities.order.Order;
import com.qadr.ecommerce.sharedLibrary.entities.product.Product;
import com.qadr.ecommerce.sharedLibrary.repo.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Getter @Setter
public class PagingAndSortingHelper {
    private String sortField;
    private String dir;
    private String keyword;
    private String name;
    private Integer catId;

    public PagingAndSortingHelper(String name, String sortField, String dir, String keyword, String catId) {
        this.name = name;
        this.dir= dir;
        this.keyword = keyword;
        this.sortField = sortField;
        if(catId != null) this.catId = Integer.valueOf(catId);

    }

    public Map<String, Object> getPageInfo(Integer number, Integer pageSze, SearchRepository<?,?> repo){
        Sort sort = Sort.by(sortField);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<?> page;
        if(Objects.equals(name, "products") && catId != null && catId > 0){
            page = repo.find(keyword, catId, "-"+catId+"-", pageable);
        }else if(keyword != null && !keyword.isBlank()){
            page = repo.searchKeyword(keyword, pageable);
        }else {
            page = repo.findAll(pageable);
        }
        return mapInfo(number, pageSze, page);
    }

    public Map<String, Object> getShipperOrders(Integer number, Integer pageSze, OrderRepo repo){
        Sort sort = Sort.by(sortField);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Order> page = repo.shipperSearch(keyword, pageable);
        return mapInfo(number, pageSze, page);
    }

    public Map<String, Object> getCustomerOrders(Integer number, Customer customer, Integer pageSze, OrderRepo repo){
        Sort sort = Sort.by(sortField);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Order> page =
                (keyword == null || keyword.isBlank()) ? repo.findAllByCustomer(customer, pageable) :
                        repo.searchAllByCustomer(customer.getId(), keyword, pageable);
        return mapInfo(number, pageSze, page);
    }

    private Map<String, Object> mapInfo(Integer number, Integer pageSze, Page<?> page){
        int startCount = (number-1) * pageSze + 1;
        int endCount = pageSze * number;
        endCount = (endCount > page.getTotalElements()) ? (int) page.getTotalElements() : endCount;
        Map<String, Object> pageInfo = new HashMap<>();
        pageInfo.put("currentPage", number);
        pageInfo.put("startCount", startCount);
        pageInfo.put("endCount", endCount);
        pageInfo.put("totalPages", page.getTotalPages());
        pageInfo.put("totalElements", page.getTotalElements());
        pageInfo.put(name, page.getContent());
        pageInfo.put("numberPerPage", pageSze);
        return pageInfo;
    }

    public Map<String, Object> searchProduct(Integer number, Integer pageSze, ProductRepo repo){
        Sort sort = Sort.by("name").ascending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Product> page = repo.search(keyword, pageable);
        return mapInfo(number, pageSze, page);
    }

    public Map<String, Object> getCustomerReviews(int number, Customer customer, int pageSze, ReviewRepository repo) {
        Sort sort = Sort.by(sortField);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Review> page =
                (keyword == null || keyword.isBlank()) ? repo.findByCustomer(customer, pageable) :
                        repo.searchByCustomer(keyword, customer.getId(), pageable);
        return mapInfo(number, pageSze, page);
    }

    public Map<String, Object> getCustomerQuestions(int number, Customer customer, int pageSze, QuestionRepo repo) {
        Sort sort = Sort.by(sortField);
        sort = (dir.equals("asc")) ? sort.ascending() : sort.descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Question> page =
                (keyword == null || keyword.isBlank()) ? repo.findByAsker(customer, pageable) :
                        repo.searchByCustomer(keyword, customer.getId(), pageable);
        return mapInfo(number, pageSze, page);
    }
    public Map<String, Object> getProductReviews(int number, Product product, int pageSze, ReviewRepository repo) {
        if(sortField == null) sortField = "votes";
        Sort sort = Sort.by(sortField).descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Review> page =  repo.findAllByProduct(product, pageable);
        return mapInfo(number, pageSze, page);
    }

    public Map<String, Object> getProductQuestions(Integer number, Integer productID, int pageSze, QuestionRepo repo) {
        if(sortField == null) sortField = "votes";
        Sort sort = Sort.by(sortField).descending();
        PageRequest pageable = PageRequest.of(number - 1, pageSze, sort);
        Page<Question> page =  repo.findAllByProduct(productID, pageable);
        return mapInfo(number, pageSze, page);
    }
}
