import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import { Navigate, useNavigate } from 'react-router-dom';
import { alterArrayDelete, alterArrayUpdate, isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, formatPrice } from "../utilities";
import Order from "./order";
import "../../css/products.css"
import useAuth from "../custom_hooks/use-auth";
import EditOrder from "./edit";
import useThrottle from "../custom_hooks/use-throttle";
import ViewCustomer from "../customers/view_customer";
import useSettings from "../custom_hooks/use-settings";

const Orders = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "orders/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth] = useAuth();
    const accessToken = auth.accessToken;
    const searchRef = useRef();
    const searchBtnRef = useRef();
    const [orders, setOrders] = useState([]);
    const [updateOrder, setUpdateOrder] = useState({show:false, id: -1, order: null, type:"View"});
    const [deleteOrder, setDeleteOrder] = useState({ show: false, id: -1 });
    const [showCustomer, setShowCustomer] = useState({ show: false, id: -1, type: "View", customer: {} });
    
    const showUpdate = (id) => {
        const order = orders.filter(u => u.id === id)[0];
        setUpdateOrder({ show: true, id, order, type: "Edit"})
    };

    const showView = (id) => {
        const order = orders.filter(u => u.id === id)[0];
        setUpdateOrder({ show: true, id, order, type: "View"})
    };

    const viewCustomer = id => {
        const order = orders.filter(u => u.id === id)[0];
        const customer = order.customer;
        setShowCustomer(s=> ({...s, show: true, customer}))
    }

    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "customer", dir: "asc" })
    
    const changePage = useCallback(function (number, keyword, button) {
        number = number ?? 1;
        keyword = keyword ?? "";
        const url = `${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`
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
                const data = response.data;
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
                setOrders(data.orders)
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

         
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();

    
    useEffect(()=>{document.title = `Orders - ${SITE_NAME}`},[SITE_NAME])
    
    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    
    useEffect(() => {
        changePage(pageInfo.number, "")
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })
    
    function deletingOrder() {
        const id = deleteOrder.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             }
        })
            .then(() => {
                alterArrayDelete(orders, id, setOrders)
                setDeleteOrder({...deleteOrder, show:false})
                alert("Order deleted!")
            })
            .catch(error => {
            console.log(error.response)
        })
    }

    function updatingOrder(Order) {
        alterArrayUpdate(Order, setOrders)
        searchRef.current.value = Order.name
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
        else setSort(state => ({ ...state, field: id, dir: "asc" }))
    }

    function listOrders(orders, type) {
        return (orders.length > 0)
            ? orders.map(order => <Order key={order.id} type={type} order={order} showUpdate={showUpdate} 
            setDeleted={setDeleteOrder} showView={showView}  showCustomer={viewCustomer} priceFunction={priceFormatter()} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No Order found</td></tr>
                : <div className="text-center">No Order found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
        <>
            <Row className="justify-content-start align-items-center p-3 mx-0">
                <Col xs={12} md={7} className="my-2">
                    <Form className="row justify-content-between" onSubmit={handleFilter}>
                        <Form.Group as={Row} className="mb-3" controlId="keyword">
                            <Col sm="2" md="2">
                                <label className="d-block text-start text-md-end fs-5" htmlFor="keyword">Filter:</label>
                            </Col>
                            <Col sm="9" md="6">
                                <Form.Control ref={searchRef}  type="text" placeholder="keyword" />
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
                            <th onClick={handleSort} id="customer"  className="cursor-pointer">Customer  {isSort("customer")}</th>
                            <th onClick={handleSort} id="total" className="cursor-pointer">Total {isSort("total")}</th>
                            <th onClick={handleSort} id="orderTime" className="cursor-pointer">
                                Order Time {isSort("orderTime")}
                            </th>
                            <th className="hideable-col">Destination</th>
                            <th onClick={handleSort} id="paymentMethod" className="hideable-col cursor-pointer">
                                Payment Method {isSort("paymentMethod")}
                            </th>
                            <th onClick={handleSort} id="orderStatus"  className="hideable-col cursor-pointer">
                                Status {isSort("orderStatus")}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrders(orders,"detailed")}
                    </tbody>
                </Table> : ""
            }
            {
                (width <= 768)
                    ? <div className="less-details p-2">
                        {listOrders(orders, "less")}
                    </div> : ""
            }
            {(orders.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
            <EditOrder updateOrder={updateOrder} setUpdateOrder={setUpdateOrder} updatingOrder={updatingOrder} priceFunction={priceFormatter()} />
            <ViewCustomer data={showCustomer} setData={setShowCustomer}/>
            <DeleteModal deleteObject={deleteOrder} setDeleteObject={setDeleteOrder} deletingFunc={deletingOrder} type="Order" />
        </>
     );
}
 
export default Orders;