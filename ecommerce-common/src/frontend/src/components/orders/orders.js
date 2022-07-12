import axios from "axios";
import { useCallback, useEffect, useRef, useState,useContext } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import MyPagination from "./paging";
import { Navigate, useNavigate } from 'react-router-dom';
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, formatPrice, SPINNERS_BORDER
 } from "../utilities";
import Order from "./order";
import { AuthContext } from "../custom_hooks/use-auth";
import ViewOrder from "./view_order";
import useThrottle from "../custom_hooks/use-throttle";
import useSettings from "../use-settings";
import UpdateStatusModal from "./update_status_modal";
import CustomToast from "../custom_toast";

const Orders = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "orders/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const accessToken = auth.accessToken;
    const searchBtnRef = useRef();
    const [orders, setOrders] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [viewOrder, setViewOrder] = useState({show:false, id: -1, order: null});
    const [orderStatus, setOrderStatus] = useState({ show: false, id: -1});
    const [toast, setToast] = useState({show: false, message: "", variant: "dark"});

    const showView = (id) => {
        const order = orders.filter(u => u.id === id)[0];
        setViewOrder({ show: true, id, order})
    };

    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "orderTime", dir: "desc" })
    
    const changePage = useCallback(function (number, search, button) {
        number = number ?? 1;
        const keyword = encodeURIComponent(search);
        const url = `${serverUrl}page/${number}?sortField=${sort.field}&dir=${sort.dir}&keyword=${keyword}`;
        
        setLoading(true);
        if (button) {
        button.disabled = true
        button.innerHTML = SPINNERS_BORDER_HTML
        }
        
        setLoading(true);
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
                setOrders(data.orders);
            })
            .catch(error => {
                const response = error?.response
                if (response && isTokenExpired(response)) {
                    setAuth(null); navigate("/login");
                } 
            })
            .finally(() => {
                    setLoading(false);
                if (button) {
                button.disabled = false
                button.innerHTML = SEARCH_ICON;
            }
            })
    }, [serverUrl, sort.field, sort.dir, accessToken, setAuth, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)

         
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();

    
    useEffect(()=>{document.title = `Orders - ${SITE_NAME}`},[SITE_NAME])
    
    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    
    useEffect(() => {
        changePage(pageInfo.number, keyword)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changePage, pageInfo?.number])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })

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
    
    function updateStatus(formData, callback) {
        const id = orderStatus.id
        const url = serverUrl + "request_return/";
        let message = null, success=false;
        axios.post(`${url}${id}`, formData, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             }
        })
        .then((res) => {
            const order = orders.find(o => o.id === id);
            order.orderStatus = "RETURN_REQUESTED";
            order.orderTracks.push(res.data);
            setOrders([...orders]);
            success = true;
            message = "Return request submitted";
        })
        .catch(error => {
            console.log(error)
            const response = error?.response
            if (response && isTokenExpired(response)) {
                setAuth(null); navigate("/login");
            }
            if (response) message = response.data.message;
        })
        .finally(()=> callback(message, success))
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
            ? orders.map(order => <Order key={order.id} type={type} order={order}
                    showView={showView} priceFunction={priceFormatter()}
                    setOrderStatus={setOrderStatus}
                 />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No Order found</td></tr>
                : <div className="text-center">No Order found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                        : <>
                <CustomToast show={toast.show} setToast={setToast} message={toast.message} variant={toast.variant} />
                <h3 className="fw-bold mt-3">My Orders</h3>
                <Row className="justify-content-start align-items-center p-1 mx-0">
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
                    (width >= 1000) ?
                    <Table bordered responsive hover className="more-details">
                        <thead className="bg-dark text-light">
                            <tr>
                                <th onClick={handleSort} id="id" className="cs">ID {isSort("id")}</th>
                                <th onClick={handleSort} id="orderTime" className="cs">
                                    Order Time {isSort("orderTime")}
                                </th>
                                <th>products</th>
                                <th onClick={handleSort} id="total" className="cs">Total {isSort("total")}</th>
                                <th onClick={handleSort} id="orderStatus" className="cs">
                                    Status {isSort("orderStatus")}
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOrders(orders,"detailed")}
                        </tbody>
                    </Table> : ""
                }
                {
                    (width <= 999)
                        ? <Row className="justify-content-center mx-0">
                            {listOrders(orders, "less")}
                        </Row> : ""
                }  
                {(orders.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
                <ViewOrder viewOrder={viewOrder} setViewOrder={setViewOrder} priceFunction={priceFormatter()} />
                <UpdateStatusModal object={orderStatus} setObject={setOrderStatus} updatingFunc={updateStatus} />
            </>
            }
            </>
       
     );
}
 
export default Orders;