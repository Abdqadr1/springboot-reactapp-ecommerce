import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import { Navigate, useNavigate } from 'react-router-dom';
import {
    alterArrayDelete, alterArrayUpdate, isTokenExpired, SEARCH_ICON,
    SPINNERS_BORDER, SPINNERS_BORDER_HTML, formatPrice, hasAnyAuthority, hasOnlyAuthority
} from "../utilities";
import Order from "./order";
import "../../css/products.css"
import useAuth from "../custom_hooks/use-auth";
import ViewOrder from "./view_order";
import useThrottle from "../custom_hooks/use-throttle";
import ViewCustomer from "../customers/view_customer";
import useSettings from "../custom_hooks/use-settings";
import EditOrder from "./edit_order";
import UpdateStatusModal from "./update_status_modal";
import CustomToast from "../custom_toast";

const Orders = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "orders/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth] = useAuth();
    const accessToken = auth.accessToken;
    const abortController = useRef(new AbortController());
    
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [orders, setOrders] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [viewOrder, setViewOrder] = useState({show:false, id: -1, order: null});
    const [updateOrder, setUpdateOrder] = useState({show:false, id: -1, order: null});
    const [deleteOrder, setDeleteOrder] = useState({ show: false, id: -1 });
    const [orderStatus, setOrderStatus] = useState({ show: false, id: -1, type: "picked" });
    const [showCustomer, setShowCustomer] = useState({ show: false, id: -1, type: "View", customer: {} });
    const [toast, setToast] = useState({show: false, message: "", variant: "dark"});

    const showView = (id) => {
        const order = orders.filter(u => u.id === id)[0];
        setViewOrder({ show: true, id, order})
    };

    const showEdit = (id) => {
        const order = orders.filter(u => u.id === id)[0];
        setUpdateOrder({ show: true, id, order})
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
    const [sort, setSort] = useState({ field: "orderTime", dir: "desc" })
    
    const changePage = useCallback(function (number, search, button) {
        number = number ?? 1;
         const keyword = (search) ? encodeURIComponent(search) : "";
        setLoading(true);
        const url = `${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`
        if (button) {
        button.disabled = true
        button.innerHTML = SPINNERS_BORDER_HTML
        }

        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            signal: abortController.current.signal
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
                setOrders(data.orders);
                setPaymentMethods(data.paymentMethods ?? null);
                setNotes(data.notes ?? null);
            })
            .catch(error => {
                const response = error?.response
                if(response && isTokenExpired(response)) navigate("/login/2")
            })
            .finally(() => {
                setLoading(false);
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
    
    function deletingOrder() {
        const id = deleteOrder.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
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

    function updatingOrder(order) {
        alterArrayUpdate(order, setOrders)
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
    
    function updateStatus() {
        const id = orderStatus.id
        const status = orderStatus.type;
        const url = serverUrl + "update_status/";
        axios.post(`${url}${id}/${status}`, null, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
        .then((res) => {
            const id = res.data.id, status = res.data.status;
            const order = orders.find(o => o.id === id);
            const data = { status, note: notes[status] }
            order.orderTracks.push(data);
            setToast(s=>({...s, show:true, message: "Order status updated"}))
            setOrders([...orders]);
        })
        .catch(error => {
            console.log(error)
            // console.log(error.response);
            setToast(s => ({ ...s, show: true, message: "An error occurred", variant: "danger" }))
        })
        .finally(() => {
            setOrderStatus(s => ({ ...s, show: false }))
        })
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
            ? orders.map(order => <Order key={order.id} type={type} order={order} setDeleted={setDeleteOrder}
                    showView={showView} showEdit={showEdit} showCustomer={viewCustomer} priceFunction={priceFormatter()}
                    setOrderStatus={setOrderStatus}
                 />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No Order found</td></tr>
                : <div className="text-center">No Order found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />    
    if(!hasAnyAuthority(auth, ["Admin", "Salesperson", "Shipper"])) return <Navigate to="/403" />
    return ( 
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :      <>
            <CustomToast show={toast.show} setToast={setToast} message={toast.message} variant={toast.variant} />
            <Row className="justify-content-start align-items-center p-3 mx-0">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage Orders</h3>
                </Col>
                <Col xs={12} md={7} className="my-2">
                    <Form className="row justify-content-between" onSubmit={handleFilter}>
                        <Form.Group as={Row} className="mb-3" controlId="keyword">
                            <Col sm="2" md="2">
                                <label className="d-block text-start text-md-end fs-5" htmlFor="keyword">Filter:</label>
                            </Col>
                            <Col sm="9" md="6">
                                <Form.Control value={keyword} onChange={e=>setKeyword(e.target.value)}  type="text" placeholder="keyword" required />
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
                (hasAnyAuthority(auth, ["Admin", "Salesperson"]))
                    ? 
                    <>
                        {
                            (width >= 769) ?
                            <Table bordered responsive hover className="more-details">
                                <thead className="bg-light text-secondary">
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
                                <tbody className="bg-light text-secondary">
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
                    </>
                    :
                    <Row className="justify-content-around mx-0">
                        {listOrders(orders)}
                    </Row>                         
            }
            
            {(orders.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
            <ViewOrder viewOrder={viewOrder} setViewOrder={setViewOrder} priceFunction={priceFormatter()} />
            {
                (hasAnyAuthority(auth, ["Admin", "Salesperson"])) &&
                <>
                    <DeleteModal deleteObject={deleteOrder} setDeleteObject={setDeleteOrder} deletingFunc={deletingOrder} type="Order" />

                    <EditOrder updateOrder={updateOrder} setUpdateOrder={setUpdateOrder} updatingOrder={updatingOrder}
                        priceFunction={priceFormatter()} paymentMethods={paymentMethods} notes={notes} />
                    <ViewCustomer data={showCustomer} setData={setShowCustomer} />
                </>
            }
            {
                (hasOnlyAuthority(auth, "Shipper")) && 
                <UpdateStatusModal object={orderStatus} setObject={setOrderStatus} updatingFunc={updateStatus} />
            }
        </>
            }
       </>
     );
}
 
export default Orders;