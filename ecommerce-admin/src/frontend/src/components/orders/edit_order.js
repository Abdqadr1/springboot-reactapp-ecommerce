import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Tab, Tabs, Table } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import { isTokenExpired, SPINNERS_BORDER_HTML, formatDate } from "../utilities";
import useAuth from "../custom_hooks/use-auth";
import useThrottle from "../custom_hooks/use-throttle";
import useArray from "../custom_hooks/use-array";

const EditOrder = ({ updateOrder, setUpdateOrder, updatingOrder }) => {
    const order = updateOrder?.order;
    // console.log(order)
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "orders/edit";
    const countryUrl = process.env.REACT_APP_SERVER_URL + "countries/list";
    const stateUrl = process.env.REACT_APP_SERVER_URL + "states/get";
    const fileURL = `${process.env.REACT_APP_SERVER_URL}product-images/`;

    const [width, setWidth] = useState(window.innerWidth);
    const { array: countries, setArray: setCountries } = useArray();
    const [statuses, setStatuses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const { array: states, setArray: setStates } = useArray();
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    // const initialForm = {order_images: [], details: form?.details ?? [],}
    const [form, setForm] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const formatDateForInput = (val, separator = "-") => {
        if (!val) return "";
        const parts = Intl.DateTimeFormat("en", { month: "2-digit", day: "2-digit", year: "numeric" }).formatToParts(new Date(val))
        const year = parts[4].value;
        const month = parts[0].value;
        const day = parts[2].value;
        const str = `${year}${separator}${month}${separator}${day}`;
        return str;
    }
    const handleInput = (e) => {
        console.log(e.target.value)
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }))
    }

    const hideModal = () => setUpdateOrder(state => ({...state, show:false}));

    useEffect(() => {
        axios.get(countryUrl)
            .then(response => {
                const data = response.data;
                setCountries(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    useEffect(() => {
        if (country !== null) {
            axios.get(`${stateUrl}?id=${country.id}`)
            .then(response => {
                const data = response.data;
                setStates(data)
            })
            .catch(err => {
                console.error(err)
            })
         }
        
    }, [country])

    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
      useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        
        // listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
        const button = submitBtnRef.current
        button.disabled=true
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(`${url}/${order.id}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(response => {
                updatingOrder(response.data);
                setAlert({ show: true, message: "Order saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = "Save"
            })
    }
    const handleSelect = (e, which) => {
        if (which === "c") {
            const name = e.target.value;
            const index = countries.findIndex(c => c.name === name);
            const country = countries[index];
            setCountry({ ...country })
            setForm(s=> ({...s, country: name }))
        } else if (which === "s") {
            const name = e.target.value;
            setState(name)
            setForm(s=> ({...s, state:name}))
        }
    }

    useEffect(() => {
        if(order){
            setAlert(state => ({...state, show: false}))
            setForm(() => ({
                ...order,
            }));
            (statuses.length < 1) && setStatuses(order.allOrderStatuses);
            (paymentMethods.length < 1) && setPaymentMethods(order.allPaymentMethods);
        }
    }, [order])

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])
    

    const listOrderTracks = () => {
        if (order) {
            if (width >= 769) {
                return (
                    <Table bordered responsive hover className="more-details">
                        <thead className="bg-dark text-light">
                            <tr>
                                <th>Updated Time</th>
                                <th>Status</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderTracks.map(track =>
                                <tr key={track.id}>
                                    <td>{formatDate(track.updatedTime, "short", "medium")}</td>
                                    <td>{track.status}</td>
                                    <td>{track.note}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )
            } else {
                return order.orderTracks.map(track =>
                    <div key={track.id} className="my-2">
                        <div>{formatDate(track.updatedTime, "short", "medium")}</div>
                        <div><strong>{track.status}</strong> {track.note}</div>
                    </div>
                )
            }
        }
        return "";
    }

    const listProducts = () => {
        if (form.orderDetails?.length > 0) {
            // console.log(form.orderDetails)
            return form.orderDetails.map((detail, i) => (
                <Row className="justify-content-center" key={detail.id}>
                    <Col xs={11} className="p-2 border rounded">
                        <Row className="justify-content-center justify-content-md-center">
                            <Col xs={11} md={5}>
                                <div>{i+1}</div>
                                    <img src={`${fileURL}${detail.product.id}/${detail.product.mainImage}`} 
                                    alt="product" className="main-image"/>
                            </Col>
                            <Col xs={11} md={6}>
                                {/* <div className="fw-bold my-2">{detail.product.name}</div>
                                <div className="my-2">Product Cost {priceFunction(detail.productCost)}</div>
                                <div className="my-2">Subtotal {`${detail.quantity} x ${priceFunction(detail.unitPrice)} = ${priceFunction(detail.subtotal)}`}</div>
                                <div className="my-2">Shipping Cost {priceFunction(detail.shippingCost)}</div> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))
        }
        return "";
    }
    
    if (!form) return "";
    return ( 
         
        <Modal show={updateOrder.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Order (ID : {form?.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border order_modal_body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={()=>setAlert({...alert, show: false})}>
                    {alert.message}
                </Alert>
                <Form className="add-user-form" onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <fieldset>
                                <Form.Group className="mb-3 row justify-content-center" controlId="id">
                                    <Form.Label className="form-label">Order ID:</Form.Label>
                                    <Form.Control value={form?.id ?? ""} name="id" required className="form-input" readOnly/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="customer">
                                    <Form.Label className="form-label">Customer:</Form.Label>
                                    <Form.Control readOnly value={`${form?.firstName} ${form?.lastName}` ?? ""} name="customer" className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="productCost">
                                    <Form.Label className="form-label">Product Cost:</Form.Label>
                                    <Form.Control onChange={handleInput} name="productCost" className="form-input" step="0.01" type="number" value={form?.productCost ?? ""} />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="subtotal">
                                    <Form.Label className="form-label">Subtotal:</Form.Label>
                                    <Form.Control onChange={handleInput} name="subtotal" className="form-input" value={form?.subtotal ?? ""} step="0.01" type="number"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="shippingCost">
                                    <Form.Label className="form-label">Shipping Cost:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.shippingCost} name="shippingCost" step="0.01" type="number" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="tax">
                                    <Form.Label className="form-label">Tax:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.tax ?? ""} name="tax" step="0.01" type="number" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="total">
                                    <Form.Label className="form-label">Total:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.total ?? ""} name="total" step="0.01" type="number" className="form-input"/>
                                    <p className="form-label"></p>
                                    <p className="mt-2 form-input ps-0">Total = Subtotal + Shipping Cost + Tax </p>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-start ms-2" controlId="paymentMethod">
                                    <Form.Label className="form-label">Payment Method:</Form.Label>
                                    <Form.Select onChange={handleInput} value={form?.paymentMethod ?? ""} name="paymentMethod" required className="form-label">
                                        {
                                            paymentMethods.map(s => <option key={s}  value={s}>{s}</option>)
                                        }
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-start ms-2" controlId="orderStatus">
                                    <Form.Label className="form-label">Status:</Form.Label>
                                    <Form.Select onChange={handleInput} value={form?.orderStatus ?? ""} name="orderStatus" required className="form-label">
                                        {
                                            statuses.map(s => <option key={s}  value={s}>{s}</option>)
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="products" title="Products">
                            {listProducts()}
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <fieldset>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDays">
                                    <Form.Label className="form-label">Delivery Days:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.deliveryDays ?? ""} name="deliveryDays" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDate">
                                    <Form.Label className="form-label">Expected Deliver Date:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.deliveryDateOnForm} name="deliveryDate"
                                        required type="date" className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                                    <Form.Label className="form-label">First Name:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.firstName ?? ""} name="firstName" className="form-input" type="text"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                                    <Form.Label className="form-label">Last Name:</Form.Label>
                                    <Form.Control onChange={handleInput} name="lastName" className="form-input" type="text" value={form?.lastName ?? ""} />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="phoneNumber">
                                    <Form.Label className="form-label">Phone Number:</Form.Label>
                                    <Form.Control onChange={handleInput} name="phoneNumber" className="form-input" value={form?.phoneNumber ?? ""}/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="mainAddress">
                                    <Form.Label className="form-label">Address Line 1:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.mainAddress ?? ""} name="mainAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="extraAddress">
                                    <Form.Label className="form-label">Address Line 2:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.extraAddress} name="extraAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="city">
                                    <Form.Label className="form-label">City:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.city} name="city" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="country">
                                    <Form.Label className="form-label">Country:</Form.Label>
                                    <Form.Select value={form?.country ?? ""} onChange={e=>handleSelect(e,"c")} name="country" className="form-input" required>
                                        <option value="" hidden>Select country</option>
                                        {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="state">
                                    <Form.Label className="form-label">State:</Form.Label>
                                    <Form.Select value={form?.state ?? ""} onChange={e=>handleSelect(e,"s")} name="state" className="form-input" required>
                                        <option value="" hidden>Select state</option>
                                        {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="postalCode">
                                    <Form.Label className="form-label">Postal Code:</Form.Label>
                                    <Form.Control onChange={handleInput} value={form?.postalCode} name="postalCode" step="0.01" required className="form-input" />
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="track" title="Track">
                            {listOrderTracks()}
                        </Tab>
                    </Tabs>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0 my-3">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                    </Row>      
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default EditOrder;