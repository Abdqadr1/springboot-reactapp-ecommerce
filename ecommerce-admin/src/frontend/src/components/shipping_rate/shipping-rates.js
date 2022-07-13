import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Table, Button } from "react-bootstrap";
import '../../css/users.css';
import DeleteModal from "../delete_modal";
import MyPagination from "../paging";
import ShippingRate from "./shipping-rate";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from "../custom_hooks/use-auth";
import { isTokenExpired, SEARCH_ICON, SPINNERS_BORDER_HTML, SPINNERS_BORDER, hasAnyAuthority } from "../utilities";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";
import AddShippingRate from "./add_shipping_rate";
import UpdateShippingRate from "./update_shipping_rate";
import useSettings from "../custom_hooks/use-settings";

const ShippingRates = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL + "shipping_rate/";
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const [auth, ] = useAuth();
    const {accessToken} = auth;
    const abortController = useRef(new AbortController());
    
    
    const [keyword, setKeyword] = useState("");
    const searchBtnRef = useRef();
    const [countries, setCountries] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const {array:rates, setArray:setShippingRates,updateItemProp, filterWithId:removeShippingRate} = useArray();
    const [updateRate, setUpdateRate] = useState({show:false, id: -1, rate: {}});
    const [deleteRate, setDeleteRate] = useState({show:false, id: -1});
    const [showAdd, setShowAdd] = useState(false);
    const showUpdate = (type, id) => {
        const rate = rates.filter(u => u.id === id)[0]
        setUpdateRate(s=> ({...s, type, show: true, id, rate}))
    };
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [sort, setSort] = useState({ field: "id", dir: "asc" })
    
     const changePage = useCallback(function (number,search,  button) {
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
                 setShippingRates(data.rates)
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
     }, [serverUrl, sort.field, sort.dir, accessToken, setShippingRates, navigate])
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
    const { SITE_NAME } = useSettings();

    useEffect(()=>{document.title = `Shipping rates - ${SITE_NAME}`},[SITE_NAME])
    

    useEffect(() => {
        abortController.current = new AbortController();
        changePage(pageInfo.number, keyword);
        return ()=> {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changePage, pageInfo?.number])

    
    useEffect(() => {
        axios.get(`${serverUrl}countries`,{
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
             signal: abortController.current.signal
        })
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
            .catch(err => {
                console.error(err)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })
    
    function toggleCOD(id, status) {
        const url = serverUrl + `${id}/cod/${status}`;
        axios.get(url,{
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                signal: abortController.current.signal
            })
            .then((response) => {
                updateItemProp(id, "cod", status)
                alert(response.data)
            })
            .catch(error => {
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
            }) 
    }
    function deletingShippingRate() {
        const id = deleteRate.id
        const url = serverUrl + "delete/" + id;
        axios.get(url, {
             headers: {
                 "Authorization": `Bearer ${accessToken}`
             },
             signal: abortController.current.signal
        })
            .then((res) => {
                removeShippingRate(res.data)
                setDeleteRate({...deleteRate, show:false})
                alert("Shipping rate deleted")
            })
            .catch(error => {
            console.log(error.response)
        })
    }

    function updatingRate(rate) {
        setShippingRates([rate]);
        setKeyword(rate.state);
    }

    function addShippingRate(rate) {
        setShippingRates(s=>[...s, rate])
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
        const id = event.target.title;
        const field = (id === sort.field) ? sort.field : id;
        const dir = (sort.dir === "asc" && field === sort.field) ? "desc" : "asc";
        setSort({ field, dir })
    }

    function listShippingRates(rates, type) {
        return (rates.length > 0)
            ? rates.map(rate => <ShippingRate key={rate.id} type={type} rate={rate} toggleCOD={toggleCOD}
                showUpdate={showUpdate} setDeleteRate={setDeleteRate} />)
            : ((type === 'detailed')
                ? <tr><td colSpan={8} className="text-center" >No rate found</td></tr>
                : <div className="text-center">No rate found</div>)
    }

    if(!accessToken) return <Navigate to="/login/2" />
    if(!hasAnyAuthority(auth, ["Admin", "Salesperson"])) return <Navigate to="/403" />

    return ( 
        <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
            <Row className="justify-content-between align-items-center p-3 mx-0">
                <Col xs={12} md={5} className="my-2">
                    <h3 className="">Manage ShippingRates</h3>
                    <div>
                        <span onClick={() => setShowAdd(true)} className="text-secondary cursor-pointer">
                            <i title="Add new shipping rate" className="bi bi-folder-plus fs-2"></i>
                        </span>
                    </div>
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
                (width >= 769) ?
                    <Table bordered responsive hover className="more-details">
                    <thead className="bg-dark text-light">
                        <tr>
                            <th onClick={handleSort} title="id" className="cursor-pointer">ID {isSort("id")}</th>
                            <th onClick={handleSort} title="country" className="cursor-pointer">Country {isSort("country")}</th>
                            <th onClick={handleSort} title="state" className="cursor-pointer">State {isSort("state")}</th>
                            <th onClick={handleSort} title="rate" className="cursor-pointer  hideable-col">Rate {isSort("rate")}</th>
                            <th onClick={handleSort} title="days" className="cursor-pointer">Days {isSort("days")}</th>
                            <th>COD Supported</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listShippingRates(rates,"detailed")}
                    </tbody>
                </Table> : ""
            }
            {
                (width <= 768)
                    ? <div className="less-details p-2">
                        {listShippingRates(rates, "less")}
                    </div> : ""
            }
            {(rates.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}
            <AddShippingRate show={showAdd} setShow={setShowAdd} addShippingRate={addShippingRate} countries={countries} />
            <UpdateShippingRate updateRate={updateRate} setUpdateRate={setUpdateRate} updatingRate={updatingRate} countries={countries} />
            <DeleteModal deleteObject={deleteRate} setDeleteObject={setDeleteRate} deletingFunc={deletingShippingRate} type="Shipping Rate" />
        </>
            }
        </>
       
     );
}
 
export default ShippingRates;