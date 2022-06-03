import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import { Navigate, useNavigate } from 'react-router-dom';
import { alterArrayAdd, alterArrayDelete,alterArrayEnable, alterArrayUpdate, getCategoriesWithHierarchy, hasAnyAuthority, isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML } from "../utilities";
import Product from "./product";
import AddProduct from './add-product'
import "../../css/products.css"
import UpdateProduct from "./update-product";
import useAuth from "../custom_hooks/use-auth";
import ViewProduct from "./view-product";
import useThrottle from "../custom_hooks/use-throttle";

const Products = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "product/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth] = useAuth();
    const accessToken = auth.accessToken;
    const searchRef = useRef();
    const searchBtnRef = useRef();
    const [products, setProducts] = useState([]);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [updateProduct, setUpdateProduct] = useState({show:false, id: -1, product: null});
    const [viewProduct, setViewProduct] = useState({show:false, id: -1, product: null});
    const [deleteProduct, setDeleteProduct] = useState({show:false, id: -1});
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const showUpdate = (id) => {
        const product = products.filter(u => u.id === id)[0];
        setUpdateProduct({ show: true, id, product})
    };
    const showView = (id) => {
        const product = products.filter((u) => u.id === id)[0];
        setViewProduct({ show: true, id, product });
    }
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "name", dir: "asc", category:0 })
    
    const changePage = useCallback(function (number, keyword, button) {
        number = number ?? 1;
        keyword = keyword ?? "";
        const url = `${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}&category=${sort.category}`
        if (button) {
        button.disabled = true
        button.innerHTML = SPINNERS_BORDER_HTML
        }
        axios.get(url, {
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
                setProducts(data.products)
                setBrands(data.brands)
            })
            .catch(error => {
                const response = error?.response
            if(response && isTokenExpired(response)) navigate("/login/2")
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
        changePage(pageInfo.number, "")
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })

    useEffect(() => {
        getCategoriesWithHierarchy(accessToken).then(data => setCategories(data));
    }, [accessToken])
    
    function deletingProduct() {
        const id = deleteProduct.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             }
        })
            .then(() => {
                alterArrayDelete(products, id, setProducts)
                setDeleteProduct({...deleteProduct, show:false})
                alert("Product deleted!")
            })
            .catch(error => {
            console.log(error.response)
        })
    }
    function addingProduct(Product) {
        alterArrayAdd(products, Product, setProducts)
    }

    function updatingProduct(Product) {
        alterArrayUpdate(Product, setProducts)
        searchRef.current.value = Product.name
    }

    function handleSelectCategory(event){
        const category = Number(event.target.value)
        setSort(state => ({...state, category}))
    }

    function handleFilter(event) {
        event.preventDefault();
        const value = searchRef.current.value
        changePage(null, value, searchBtnRef.current)
    }
    function clearFilter() {
        if (searchRef.current?.value) {
            searchRef.current.value = "";
        }
        setSort(state => ({...state, category: 0}))
        changePage(null)
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
        if (id === sort.field) setSort(state => ({ ...state, dir }))
        else setSort(state => ({...state, field: id, dir: "asc" }))
    }
    function toggleEnable(id, status) {
      const url = serverUrl + `${id}/enable/${status}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          alterArrayEnable(products, id, status, setProducts);
          alert(response.data);
        })
        .catch((error) => {
          const response = error.response;
          if (isTokenExpired(response)) navigate("/login/2");
        });
    }

    function listProducts(products, type) {
        return (products.length > 0)
            ? products.map(product => <Product key={product.id} type={type} product={product} showUpdate={showUpdate} 
            setDeleted={setDeleteProduct}  toggleEnable={toggleEnable}  showView={showView} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No Product found</td></tr>
                : <div className="text-center">No Product found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <>
            <Row className="justify-content-between align-items-center p-3 mx-0">
                <Col xs={12} md={4} className="my-2">
                    <h3 className="">Manage Products</h3>
                    {
                        (hasAnyAuthority(auth, ["Admin", "Editor"]))
                         ? (<div>
                                <span onClick={() => setShowAddProduct(true)} className="text-secondary cursor-pointer">
                                    <i title="Add new Product" className="bi bi-folder-plus fs-2"></i>
                                </span>
                                {/* <a href={`${serverUrl}export/csv`} className="text-secondary cursor-pointer">
                                    <i title="Export products to csv" className="bi bi-filetype-csv fs-2 ms-2"></i>  
                                </a> */}
                            </div>) : ""
                    }
                </Col>
                <Col xs={12} md={8} className="my-2">
                    <Form className="row justify-content-center" onSubmit={handleFilter}>
                        <Form.Group as={Row} className="mb-3" controlId="keyword">
                            <Col sm="12" md="1">
                                <label className="d-block text-start text-md-end fs-5" htmlFor="keyword">Filter:</label>
                            </Col>
                            <Col sm={9} md={3}>
                                <Form.Select name="brand" value={sort.category} onChange={handleSelectCategory}>
                                    <option value={0}>All categories</option>
                                    {(categories ?? []).map((cat,i) => <option key={'cat'+i} value={cat.id}>{cat.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col sm="9" md="4" className="mt-md-0 mt-2">
                                <Form.Control ref={searchRef}  type="text" placeholder="keyword" />
                            </Col>
                            <Col sm="12" md="3" className="mt-md-0 mt-2">
                                <div>
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
                            <th>Main image</th>
                            <th onClick={handleSort} id="name" className="cursor-pointer">Product Name {isSort("name")}</th>
                            <th className="hideable-col">Brand</th>
                            <th className="hideable-col">Category</th>
                            {
                                (hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson"])) ? <th>Enabled</th>: ""
                            }
                             {
                                (hasAnyAuthority(auth, ["Admin", "Editor", "Salesperson", "Shipper"])) ? <th>Actions</th> : ""
                            }
                            
                        </tr>
                    </thead>
                    <tbody>
                        {listProducts(products,"detailed")}
                    </tbody>
                </Table> : ""
            }
            {
                (width <= 768)
                    ? <div className="less-details p-2">
                        {listProducts(products, "less")}
                    </div> : ""
            }
            {(products.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
            <AddProduct showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} addingProduct={addingProduct} brands={brands}/>
            <UpdateProduct brands={brands} updateProduct={updateProduct} setUpdateProduct={setUpdateProduct} updatingProduct={updatingProduct}/>
            <ViewProduct viewProduct={viewProduct} setViewProduct={setViewProduct} />
            <DeleteModal deleteObject={deleteProduct} setDeleteObject={setDeleteProduct}   deletingFunc={deletingProduct} type="Product" />
        </>
     );
}
 
export default Products;