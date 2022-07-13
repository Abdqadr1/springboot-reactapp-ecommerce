import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import Customer from "./customer";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import ViewCustomer from "./view_customer";
import useSettings from "../custom_hooks/use-settings";

const Customers = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "customer/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth, ] = useAuth();
    const {accessToken} = auth;
    const abortController = useRef(new AbortController());
    
    
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const {array:customers, setArray:setCustomers, filterWithId:removeCustomer, updateItemProp} = useArray();
    const [updateCustomer, setUpdateCustomer] = useState({type:"View",show:false, id: -1, customer: {}});
    const [deleteCustomer, setDeleteCustomer] = useState({show:false, id: -1});
    const showUpdate = (type, id) => {
        const customer = customers.filter(u => u.id === id)[0]
        setUpdateCustomer(s=> ({...s, type, show: true, id, customer}))
    };
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "firstName", dir: "asc" })
    
     const changePage = useCallback(function (number, search, button) {
        number = number ?? 1;
         const keyword = (search) ? encodeURIComponent(search) : "";
        setLoading(true);
         if (button) {
            button.disabled = true
            button.innerHTML = SPINNERS_BORDER_HTML
         }
         axios.get(`${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
         })
             .then(response => {
                 const data = response.data
                 setPageInfo(state => ({
                     ...state,
                     endCount: data.endCount,
                     startCount: data.startCount,
                     totalPages: data.totalPages,
                     totalElements: data.totalElements,
                     numberPerPage: data.numberPerPage
                 }))
                 setCustomers(data.customers)
             })
             .catch(error => {
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
             })
             .finally(() => {
                 setLoading(false);
                 if (button) {
                    button.disabled = false
                    button.innerHTML = SEARCH_ICON;
                }
             })
     }, [serverUrl, sort.field, sort.dir, accessToken, setCustomers, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const {SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `Customers - ${SITE_NAME}`},[SITE_NAME])
    

    useEffect(() => {
        abortController.current = new AbortController();
        changePage(pageInfo.number, keyword);
        return ()=> {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })
    
    function toggleEnable(id, status) {
        const url = serverUrl + `${id}/enable/${status}`;
        axios.get(url,{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                signal: abortController.current.signal
            })
            .then((response) => {
                updateItemProp(id, "enabled", status)
                alert(response.data)
            })
            .catch(error => {
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
            }) 
    }
    function deletingCustomer() {
        const id = deleteCustomer.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then(() => {
                removeCustomer(customers)
                setDeleteCustomer({...deleteCustomer, show:false})
                alert("customer deleted!")
            })
            .catch(error => {
            console.log(error.response)
        })
    }

    function updatingCustomer(customer) {
        setCustomers([customer])
        setKeyword(customer.email.split("@")[0]);
    }

    function handleFilter(event) {
        event.preventDefault();
        pageInfo.number = 1;
        changePage(null, keyword, searchBtnRef.current)
    }
    function clearFilter() {
       if (keyword.length > 1) {
            setKeyword("")
            pageInfo.number = 1;
            changePage(null, "")
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
        const field = (id === sort.field) ? sort.field : id;
        const dir = (sort.dir === "asc" && field === sort.field) ? "desc" : "asc";
        setSort({ field, dir })
    }

    function listCustomers(customers, type) {
        return (customers.length > 0)
            ? customers.map(customer => <Customer key={customer.id} type={type} customer={customer} toggleEnable={toggleEnable}
                showUpdate={showUpdate} setDeleteCustomer={setDeleteCustomer} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No customer found</td></tr>
                : <div className="text-center">No customer found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    if(!hasAnyAuthority(auth, ["Admin", "Salesperson"])) return <Navigate to="/403" />
    return ( 
          <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        :<>
                <Row className="justify-content-between align-items-center p-3 mx-0">
                    <Col xs={12} md={5} className="my-2">
                        <h3 className="">Manage Customers</h3>
                        <div>
                            <a href={`${serverUrl}export/csv`} className="text-secondary cursor-pointer">
                                <i title="Export customers to csv" className="bi bi-filetype-csv fs-2 ms-2"></i>  
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
                                    <Form.Control value={keyword} onChange={e=>setKeyword(e.target.value)} type="text" placeholder="keyword" required />
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
                                <th onClick={handleSort} id="id" className="cursor-pointer">customer ID {isSort("id")}</th>
                                <th onClick={handleSort} id="firstName" className="cursor-pointer">First Name {isSort("firstName")}</th>
                                <th onClick={handleSort} id="lastName" className="cursor-pointer">Last Name {isSort("lastName")}</th>
                                <th onClick={handleSort} id="email" className="cursor-pointer  hideable-col">Email {isSort("email")}</th>
                                <th onClick={handleSort} id="country" className="cursor-pointer">Country {isSort("country")}</th>
                                <th onClick={handleSort} id="state" className="cursor-pointer  hideable-col">State {isSort("state")}</th>
                                <th onClick={handleSort} id="city" className="cursor-pointer  hideable-col">City {isSort("city")}</th>
                                <th>Enabled</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCustomers(customers,"detailed")}
                        </tbody>
                    </Table> : ""
                }
                {
                    (width <= 768)
                        ? <div className="less-details p-2">
                            {listCustomers(customers, "less")}
                        </div> : ""
                }
                {(customers.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
                <ViewCustomer data={updateCustomer} setData={setUpdateCustomer} updatingCustomer={updatingCustomer}/>
                <DeleteModal deleteObject={deleteCustomer} setDeleteObject={setDeleteCustomer}   deletingFunc={deletingCustomer} type="customer" />
            </>
        }
        
        </>
     );
}
 
export default Customers;