import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import { Navigate, useNavigate } from 'react-router-dom';
import { alterArrayAdd, alterArrayDelete, alterArrayUpdate, getCategoriesWithHierarchy, isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML } from "../utilities";
import Brand from "./brand";
import AddBrand from './add-brand'
import UpdateBrand from "./update-brand";
import useAuth from "../custom_hooks/use-auth";
import useThrottle from "../custom_hooks/use-throttle";

const Brands = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "brand/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [{accessToken}] = useAuth();
    
    const searchRef = useRef();
    const searchBtnRef = useRef();
    const [brands, setBrands] = useState([]);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [updateBrand, setUpdateBrand] = useState({show:false, id: -1, brand: {}});
    const [deleteBrand, setDeleteBrand] = useState({show:false, id: -1});
    const showUpdate = (id) => {
        const brand = brands.filter(u => u.id === id)[0]
        setUpdateBrand({ show: true, id, brand})
    };
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "name", dir: "asc" })
    const [categories, setCategories] = useState([])
    
     const changePage = useCallback(function (number, button) {
        number = number ?? 1;
        const keyword = encodeURIComponent(searchRef.current.value);
         if (button) {
            button.disabled = true
            button.innerHTML = SPINNERS_BORDER_HTML
         }
         axios.get(`${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             }
         })
             .then(response => {
                 const data = response.data
                 setPageInfo(state => (
                     {
                     ...state,
                     endCount: data.endCount,
                     startCount: data.startCount,
                     totalPages: data.totalPages,
                     totalElements: data.totalElements,
                     numberPerPage: data.numberPerPage
                     }
                 ))
                 setBrands(data.brands)
             })
             .catch(error => {
                 const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 if (button) {
                    button.disabled = false
                    button.innerHTML = SEARCH_ICON;
                }
             })
     }, [sort, serverUrl, accessToken, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    
    useEffect(() => {
        changePage(pageInfo.number)
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })
    useEffect(() => {
        getCategoriesWithHierarchy(accessToken)
            .then(data => setCategories(data))
    }, [accessToken])
    
    function deletingBrand() {
        const id = deleteBrand.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             }
        })
            .then(() => {
                alterArrayDelete(brands, id, setBrands)
                setDeleteBrand({...deleteBrand, show:false})
                alert("Brand deleted!")
            })
            .catch(error => {
            console.log(error.response)
        })
    }
    function addingBrand(brand) {
        alterArrayAdd(brands, brand, setBrands)
    }

    function updatingBrand(brand) {
        alterArrayUpdate(brand, setBrands)
        searchRef.current.value = brand.name
    }

    function handleFilter(event) {
        event.preventDefault();
        pageInfo.number = 1;
        changePage(null, searchBtnRef.current)
    }
    function clearFilter() {
       if (searchRef.current?.value) {
            searchRef.current.value = "";
            pageInfo.number = 1;
            changePage(null)
        }
    }
    
    function isSort(name) {
        if (name === sort.field) {
           if(sort.dir === "asc") return (<i className="bi bi-caret-up-fill text-light"></i> )
           else return (<i className="bi bi-caret-down-fill text-light"></i> )
        }
        return ""
    }

    function handleSort(event) {
        const id = event.target.id;
        const dir = sort.dir === "asc" ? "desc": "asc"
        if (id === sort.field) setSort({ ...sort, dir })
        else setSort({ field: id, dir: "asc" })
    }

    function listBrands(brands, type) {
        return (brands.length > 0)
            ? brands.map(brand => <Brand key={brand.id} type={type} brand={brand} showUpdate={showUpdate} setDeleted={setDeleteBrand} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No brand found</td></tr>
                : <div className="text-center">No brand found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <>
            <Row className="justify-content-between align-items-center p-3 mx-0">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage Brands</h3>
                    <div>
                        <span onClick={() => setShowAddBrand(true)} className="text-secondary cursor-pointer">
                            <i title="Add new brand" className="bi bi-folder-plus fs-2"></i>
                        </span>
                        <a href={`${serverUrl}export/csv`} className="text-secondary cursor-pointer">
                            <i title="Export brands to csv" className="bi bi-filetype-csv fs-2 ms-2"></i>  
                        </a>
                    </div>
                </Col>
                <Col xs={12} md={7} className="my-2">
                    <Form className="row justify-content-between" onSubmit={handleFilter}>
                        <Form.Group as={Row} className="mb-3" controlId="keyword">
                            <Col sm="2" md="2">
                                <label className="d-block text-start text-md-end fs-5" htmlFor="keyword">Filter:</label>
                            </Col>
                            <Col sm="9" md="6">
                                <Form.Control ref={searchRef}  type="text" placeholder="keyword" required/>
                            </Col>
                            <Col sm="12" md="4">
                            <div className="mt-md-0 mt-2">
                                <Button ref={searchBtnRef} variant="primary" className="mx-1" type="submit">
                                     <i title="search keyword" className="bi bi-search"></i>   
                                </Button>
                                <Button onClick={clearFilter} variant="secondary" className="mx-1" type="button" alt="clear search">
                                    <i title="clear keyword" className="bi bi-eraser"></i>
                                </Button>
                            </div>
                            </Col>
                        </Form.Group>
                    </Form> 
                </Col>
            </Row>
            {
                (width >= 769) ?
                <Table bordered responsive hover className="more-details">
                    <thead className="bg-dark text-light">
                        <tr>
                            <th onClick={handleSort} id="id" className="cursor-pointer">ID {isSort("id")}</th>
                            <th>Logo</th>
                            <th onClick={handleSort} id="name" className="cursor-pointer">Name {isSort("name")}</th>
                            <th  className="hideable-col">Categories</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listBrands(brands,"detailed")}
                    </tbody>
                </Table> : ""
            }
            {
                (width <= 768)
                    ? <div className="less-details p-2">
                        {listBrands(brands, "less")}
                    </div> : ""
            }
            {(brands.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
            <AddBrand categories={categories} showAddBrand={showAddBrand} setShowAddBrand={setShowAddBrand} addingBrand={addingBrand}/>
            <UpdateBrand categories={categories} updateBrand={updateBrand} setUpdateBrand={setUpdateBrand} updatingBrand={updatingBrand} />
            <DeleteModal deleteObject={deleteBrand} setDeleteObject={setDeleteBrand}   deletingFunc={deletingBrand} type="Brand" />
        </>
     );
}
 
export default Brands;