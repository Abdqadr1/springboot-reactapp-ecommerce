package com.qadr.ecommerce.sharedLibrary.paging;

import com.qadr.ecommerce.sharedLibrary.entities.Customer;
import com.qadr.ecommerce.sharedLibrary.repo.SearchRepository;
import com.qadr.ecommerce.sharedLibrary.util.CommonUtil;
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
}
