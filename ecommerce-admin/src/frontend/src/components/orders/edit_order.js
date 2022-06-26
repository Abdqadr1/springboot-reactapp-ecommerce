import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import { isTokenExpired, SPINNERS_BORDER_HTML, listFormData, getShortName, isInArray } from "../utilities";
import useAuth from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";
import ProductSearchModal from "./product_search_modal";
import CustomToast from "../custom_toast";

const EditOrder = ({ updateOrder, setUpdateOrder, updatingOrder, priceFunction, paymentMethods, notes }) => {
    const order = updateOrder?.order;
    // console.log(notes)
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "orders/edit";
    const countryUrl = process.env.REACT_APP_SERVER_URL + "countries/list";
    const stateUrl = process.env.REACT_APP_SERVER_URL + "states/get";
    const shippingRate = process.env.REACT_APP_SERVER_URL + "shipping_rate/get_shipping_rate";
    const fileURL = `${process.env.REACT_APP_SERVER_URL}product-images/`;
    const [toast, setToast] = useState({show: false, message: ""});
    const { array: countries, setArray: setCountries } = useArray();
    const { array: states, setArray: setStates } = useArray();
    const [country, setCountry] = useState(null);
    const [, setState] = useState(null);
    const [form, setForm] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [showAddProduct, setShowAddProduct] = useState(false)
    const alertRef = useRef();
    const handleInput = (e) => {
        const type = e.target.getAttribute("type");
        if (type === "number") {
            const name = e.target.name;
            const value = e.target.value;
            form[name] = value;
            form.total = Number(Number(form.subtotal) + Number(form.shippingCost) + Number(form.tax)).toFixed(2);
            setForm(s=> ({...s}))
            return;
        }
        const name = e.target.name;
        const val = e.target.value;
        form[name] = val;
        setForm(s=>({...s}))
    }
    const handleProductInput = e => {
        const index = e.target.getAttribute("data-index");
        const orderDetails = form.orderDetails;
        const detail = orderDetails[index];
        detail[e.target.id] = e.target.value;
        detail.subtotal = Number(detail.quantity * detail.unitPrice).toFixed(2);
        reCalculate();
    }
    const reCalculate = () => {
        let subtotal = 0, productCost = 0, shippingCost = 0;
        form.orderDetails.forEach(detail => {
            productCost += Number(detail.productCost);
            shippingCost += Number(detail.shippingCost);
            subtotal += Number(detail.subtotal);
        })
        const total = subtotal + shippingCost + Number(form.tax);
        console.log(subtotal, productCost, shippingCost, total)
        setForm(s => ({
            ...s,
            productCost: productCost.toFixed(2),
            subtotal: subtotal.toFixed(2),
            shippingCost: shippingCost.toFixed(2),
            total: total.toFixed(2),
            orderDetails : [...s.orderDetails]
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

    useEffect(() => {
        if(order){
            setAlert(state => ({ ...state, show: false }))
            setForm(() => ({
                ...order,
            }));
            const country = countries.find(c => c.name === order.country);
            setCountry({ ...country })
        }
    }, [order])

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])

    const writeFormData = () => {
        const dateValues = ["deliveryDate", "orderTime", "deliveryDateOnForm"];
        const data = new FormData();
        Object.keys(form).forEach(key => {
            const val = form[key];
            if (typeof (val) === "object") {
                if (key === "customer") data.set(key, form.customer.id);

                if (key === "orderDetails" || key === "orderTracks") {
                    val.forEach(obj => {
                        let k = key === "orderDetails" ? "_detail_" : "_track_";
                        Object.keys(obj).forEach(key => {
                            let val = obj[key];
                            if (typeof (val) === "object") val = val.id;
                            data.append(k + key, val);
                        })
                    });
                }
            } else {
                // for date values
                if (isInArray(key, dateValues)) {
                    const date = new Date(val).toUTCString();
                    data.set(key, date);
                } else {
                    data.set(key, val);
                }
            }
        })
        listFormData(data)
        return data;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = writeFormData();

        setAlert((state) => ({ ...state, show: false }));
        const button = submitBtnRef.current
        button.disabled=true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
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
                button.innerHTML = text;
            })
    }
    const handleSelect = (e, which) => {
        if (which === "c") {
            const name = e.target.value;
            const country = countries.find(c => c.name === name);
            setCountry({ ...country })
            setForm(s=> ({...s, country: name }))
        } else if (which === "s") {
            const name = e.target.value;
            setState(name)
            setForm(s=> ({...s, state:name}))
        }
    }
    const handleTrackRecord = (e, i) => {
        console.log(e.target.value)
        const orderTracks = form.orderTracks;
        const track = orderTracks[i];
        track[e.target.id] = e.target.value;
        if (e.target.id === "updatedTime") track["timeInForm"] = e.target.value;
    if (e.target.id === "status") track["note"] = notes[e.target.value];
        setForm(s=>({...s, orderTracks}))
    }


    const selectHandler = p => {
        setShowAddProduct(false);
        const test = form.orderDetails.some(detail => detail.product.id === p.id);
        if (test) {
            const message = "The product " + getShortName(p.name, 30) + " was already added";
            setToast(s => ({ ...s, show: true, message }));
            return;
        }
        const data = new FormData();
        data.set("country", country.id);
        data.set("product", p.id);
        (form.state.length > 0) ? data.set("state", form.state) : data.set("state", form.city);
        let shippingCost = 0;
        axios.post(shippingRate,data, { headers: { "Authorization": `Bearer ${accessToken}` } })
        .then(res => {
            // console.log(res.data)
            shippingCost = Number(res.data)
        }).catch(err => {
            // console.log(err)
            setToast(s => ({ ...s, show: true, message: err.response.data.message }));
        }).finally(() => {
            const detail = { product: p, productCost: p.cost, subtotal: p.realPrice, quantity: 1, unitPrice: p.realPrice, shippingCost, id:"" }
            form.orderDetails.push(detail);
            reCalculate();
        })

    } 
    const removeProduct = index => {
        console.log(index);
        if (form.orderDetails.length < 2) {
            setToast(s => ({ ...s, show: true, message: "Could not remove product, The order must have at least one product" }));
            return;
        }
        form.orderDetails = form.orderDetails.filter((d, i) => i !== index);
        reCalculate();
    }
    const removeOrderTrack = index => {
        const orderTracks = form.orderTracks.filter((d, i) => i !== index);
        setForm(s=>({...s, orderTracks}))
    }
    const addOrderTrack = e => {
        const track = { 
            updatedTime: "", status: "PROCESSING", note: notes["PROCESSING"], id: "", timeInForm: ""
        }
        setForm(s=>({...s, orderTracks: [...s.orderTracks, track]}))
    }

    const listProducts = () => {
        if (form.orderDetails?.length > 0) {
            // console.log(form.orderDetails)
            return form.orderDetails.map((detail, i) => (
                <Row className="justify-content-center justify-content-md-center my-2 pt-2 border rounded" key={detail.product.id}>
                    <Col xs={11} md={5}>
                        <div>{i+1}</div>
                        <div><i onClick={e=> removeProduct(i)} className="bi bi-archive-fill fs-5 text-danger py-3"></i></div>
                            <img src={`${fileURL}${detail.product.id}/${detail.product.mainImage}`} 
                            alt="product" className="main-image"/>
                    </Col>
                    <Col xs={11} md={6}>
                        <p className="fw-bold text-start">{detail.product.name}</p>
                        <Form.Group className="mb-3 row justify-content-center" controlId={"productCost"}>
                            <Form.Label className="form-label">Product Cost:</Form.Label>
                            <Form.Control onChange={handleProductInput} value={detail.productCost ?? ""} data-index={i} name="productCost" 
                            required className="form-label" type="number" step="0.01"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center" controlId="quantity">
                            <Form.Label className="form-label">Quantity:</Form.Label>
                            <Form.Control onChange={handleProductInput} value={detail.quantity ?? ""} data-index={i} name="quantity" 
                            required className="form-label" type="number" step="0.01"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center" controlId="unitPrice">
                            <Form.Label className="form-label">Unit Price:</Form.Label>
                            <Form.Control onChange={handleProductInput} value={detail.unitPrice ?? ""} data-index={i} name="unitPrice" 
                            required className="form-label" type="number" step="0.01"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center" controlId="subtotal">
                            <Form.Label className="form-label">Subtotal:</Form.Label>
                            <Form.Control onChange={handleProductInput} value={detail.subtotal ?? ""} data-index={i} name="subtotal" 
                            required className="form-label" readOnly type="number" step="0.01"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-center" controlId="shippingCost">
                            <Form.Label className="form-label">Shipping Cost:</Form.Label>
                            <Form.Control onChange={handleProductInput} value={detail.shippingCost ?? ""} data-index={i} name="shippingCost" 
                            required className="form-label" type="number" step="0.01"/>
                        </Form.Group>
                    </Col>
                </Row>
            ))
        }
        return "";
    }

    const listOrderTracks = () => {
        if (form.orderTracks?.length > 0) {
            const map = form.orderTracks.map((track, i) => (
                <Col xs={11} key={i} className="my-2 py-2 border rounded">
                    {(track.status !== "NEW" && i!==0) && <i onClick={e=> removeOrderTrack(i)} className="bi bi-archive-fill fs-6 text-secondary p-3" title="delete track"></i>}
                        
                    <fieldset  disabled={i===0}>
                        <Form.Group className="mb-3 row justify-content-start ms-2" controlId="updatedTime">
                            <Form.Label className="form-label">Time:</Form.Label>
                            <Form.Control onChange={e=>handleTrackRecord(e,i)} value={track.timeInForm} name="updatedTime" type="datetime-local" required className="form-input"/>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-start ms-2" controlId="status">
                            <Form.Label className="form-label">Status:</Form.Label>
                            <Form.Select onChange={e=>handleTrackRecord(e,i)} value={track.status} name="status" required className="form-label">
                                {
                                    Object.keys(notes).map(s => <option key={s}  value={s}>{s}</option>)
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3 row justify-content-start ms-2" controlId="note">
                            <Form.Label className="form-label">Note:</Form.Label>
                            <Form.Control as="textarea" onChange={e=>handleTrackRecord(e,i)} value={track.note} name="note"  required className="form-input"/>
                        </Form.Group>
                    </fieldset>
                    
                </Col>
            ))  
            return <Row className="justify-content-center p-2 mx-0">
                {map}
            </Row> 
        } else {
            return "";
        }
    }
    
    if (!form) return "";
    return ( 
         <>
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
                                                    Object.keys(notes).map(s => <option key={s}  value={s}>{s}</option>)
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </fieldset>
                                </Tab>
                                <Tab eventKey="products" title="Products">
                                    {listProducts()}
                                    <Button onClick={e=>setShowAddProduct(true)} variant="success" className="p-3">Add Product</Button>
                                </Tab>
                                <Tab eventKey="shipping" title="Shipping">
                                    <fieldset>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDays">
                                            <Form.Label className="form-label">Delivery Days:</Form.Label>
                                            <Form.Control onChange={handleInput} value={form?.deliveryDays ?? ""} name="deliveryDays" required className="form-input"/>
                                        </Form.Group>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDateOnForm">
                                            <Form.Label className="form-label">Expected Deliver Date:</Form.Label>
                                            <Form.Control onChange={handleInput} value={form?.deliveryDateOnForm} name="deliveryDateOnForm"
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
                                            <Form.Control onChange={handleInput} value={form?.extraAddress} name="extraAddress" step="0.01" className="form-input" />
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
                                    <Button onClick={addOrderTrack} variant="success" className="p-3">Add Track Record</Button>
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
            <CustomToast show={toast.show} setToast={setToast} message={toast.message} variant="warning"/>
            <ProductSearchModal show={showAddProduct} setShow={setShowAddProduct} priceFunction={priceFunction} selectHandler={selectHandler} />
         </>
       
     );
}
 
export default EditOrder;