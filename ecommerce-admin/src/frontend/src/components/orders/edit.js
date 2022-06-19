import axios from "axios";
import {useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired, SPINNERS_BORDER_HTML, formatDate } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const EditOrder = ({ updateOrder, setUpdateOrder, updatingOrder, priceFunction }) => {
    const order = updateOrder?.order;
    const [{accessToken}] = useAuth()
    const navigate = useNavigate()
    const submitBtnRef = useRef();
    const url = process.env.REACT_APP_SERVER_URL + "order/edit";
    const fileURL = `${process.env.REACT_APP_SERVER_URL}product-images/`;

    const initialForm = {order_images: [], details: order?.details ?? [],}
    const [form, setForm] = useState(initialForm);
    const [mainImage, setMainImage] = useState("");
    const [images, setImages] = useState([]);
    const [nameRef, valueRef, formRef] = [useRef(), useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    let handleInput;
    if (updateOrder.type === "View") handleInput = () => {};
    else handleInput = (e) => {
        setForm(s => ({
            ...s,
            [e.target.name]: e.target.value
        }))
    }
    const hideModal = () => setUpdateOrder(state => ({...state, show:false}));

    const isImageAdded = (data) => {
        data.delete("main_image");
        data.delete("extra_image");
        data.delete("saved_image");
        if(form.main_image instanceof File){
            data.set("main_image", form.main_image);
        }
        form.order_images.forEach(img => data.append("extra_image", img))
        form.savedImages.forEach(img => data.append("saved_image", `${img.id}<>${img.path}`))
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(formRef.current);
        if(!isImageAdded(data)) return;
        
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

    useEffect(() => {
        if(order){
            setAlert(state => ({...state, show: false}))
            setForm(() => ({
                ...order,
            }));
        }
    }, [order])

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])
    const handleClearImage = (type, id) => {
        if(type === "m"){
            setMainImage("");
            setForm(state => ({...state, main_image: ""}))
        }else if(type === "e") {
            const formImages = form.order_images.filter((file, i) => i !== id);
            const imgs = images.filter((img, i) => i !== id);
            setForm(state => ({...state, order_images: [...formImages]}));
            setImages([...imgs])
        } else {
            const imgs = form.savedImages.filter((f, i) => i !== id);
            setForm(state => ({...state, savedImages: [...imgs]}))
        }
       
    }

    const handleAddDetail  = () => {
        const nameInput = nameRef.current;
        const valueInput = valueRef.current;
        if(nameInput.value.length === 0){
            nameInput.setCustomValidity("Required");
            return;
        }else {nameInput.setCustomValidity("")}
        if(valueInput.value.length === 0){
            valueInput.setCustomValidity("Required");
            return;
        }else {valueInput.setCustomValidity("")}
        
        form.details[form.details.length] = {
            name: nameInput.value, value: valueInput.value
        };
        setForm(state => ({
            ...state,
            details: [...state.details]
        }))
        nameInput.value =""; valueInput.value="";
    }
    const handleDetail = (event, i) => {
        const value = event.target.value;
        const which = event.target.id;
        const detail = form.details[i];
        detail[which] = value;
        setForm(state => ({
            ...state, details: [...state.details]
        }))

    }
    const handleRemoveDetail = (id) => { 
        setForm((state) => ({
          ...state,
          details: state.details.filter((d, i) => i !== id),
        }));
        console.log("removing.. " + id);
    }

    const listExtraImages = () => {
        let saved=[]; let selected=[]
        if(form.savedImages.length > 0){
            saved = form.savedImages.map((img, i) => (
                <Col key={'saved'+i} md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>{`Extra image #${i+1}`}</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("s",i)}></i>
                    </h5>
                    <img src={`${fileURL}extras/${img.path}`}  alt="order" className="order-image" />
                </Col>
            ))
        }
        if(form.order_images.length > 0){
            selected =images.map((image,i) => (
                <Col key={'new_extra'+i} md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>{`New image #${i+1}`}</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("e",i)}></i>
                    </h5>
                    {image}
                </Col>
            ))
        }
        return [...saved, ...selected];
    }

    const listMainImage = () => {
        if(form.main_image instanceof File){
            return (<Col md={4} className="border py-2">
                    <h5 className="px-1 text-center d-flex justify-content-between">
                        <span>Main image</span>
                        <i title={`Remove image`} className="bi bi-x-circle-fill text-danger" onClick={()=>handleClearImage("m")}></i>
                    </h5>
                    {mainImage}
                </Col>)
        } else {
            return (
                <Col md={4} className="border py-2">
                    <h5 className="px-1 text-center">Main image</h5>
                    <img src={`${fileURL}${order?.mainImage}`}  alt="order" className="order-image" />
                </Col>)
        }
    }

    const listDetails = () => {
        return form.details.map((detail, i) => (
                <Row key={i} className="mt-3">
                    <Form.Group className="col-5 row justify-content-center" controlId="name">
                        <Form.Label className="form-label fw-bold">Name:</Form.Label>
                        <Form.Control name="detail_name" value={detail?.name} onChange={e=>handleDetail(e, i)} required className="form-input" maxLength={255} />
                    </Form.Group>
                    <Form.Group className="col-6 row justify-content-center" controlId="value">
                        <Form.Label className="form-label fw-bold">Value:</Form.Label>
                        <Form.Control name="detail_value" value={detail?.value} onChange={e=>handleDetail(e, i)} required className="form-input" maxLength={255} />
                    </Form.Group>
                    <Col>
                        <i title={`Remove detail`} className="bi bi-x-circle-fill rm-detail" 
                            onClick={() => handleRemoveDetail(i)}></i>
                    </Col>
                </Row>
            ))
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
                                <div className="fw-bold my-2">{detail.product.name}</div>
                                <div className="my-2">Product Cost {priceFunction(detail.productCost)}</div>
                                <div className="my-2">Subtotal {`${detail.quantity} x ${priceFunction(detail.unitPrice)} = ${priceFunction(detail.subtotal)}`}</div>
                                <div className="my-2">Shipping Cost {priceFunction(detail.shippingCost)}</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))
        }
        return "";
    }
    
    if(!accessToken) return <Navigate to="/login/2" />
    return ( 
         
        <Modal show={updateOrder.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{updateOrder.type} Order (ID : {order?.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border order_modal_body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form ref={formRef} className="add-user-form" onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <fieldset disabled={updateOrder.type === "View"}>
                                <Form.Group className="mb-3 row justify-content-center" controlId="id">
                                    <Form.Label className="form-label">Order ID:</Form.Label>
                                    <Form.Control onChange={null} value={order?.id ?? ""} name="id" required className="form-input" disabled/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="customer">
                                    <Form.Label className="form-label">Customer:</Form.Label>
                                    <Form.Control onChange={handleInput} value={`${order?.firstName} ${order?.lastName}` ?? ""} name="customer" className="form-input" type="text"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="productCost">
                                    <Form.Label className="form-label">Product Cost:</Form.Label>
                                    <Form.Control onChange={handleInput} name="productCost" className="form-input" type="text" value={priceFunction(order?.productCost) ?? ""} />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="subtotal">
                                    <Form.Label className="form-label">Subtotal:</Form.Label>
                                    <Form.Control onChange={handleInput} name="subtotal" className="form-input" value={priceFunction(order?.subtotal) ?? ""}/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="shippingCost">
                                    <Form.Label className="form-label">Shipping Cost:</Form.Label>
                                    <Form.Control onChange={handleInput} value={priceFunction(order?.shippingCost)} name="shippingCost" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="tax">
                                    <Form.Label className="form-label">Tax:</Form.Label>
                                    <Form.Control onChange={handleInput} value={priceFunction(order?.tax )?? ""} name="tax" step="0.01" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="total">
                                    <Form.Label className="form-label">Total:</Form.Label>
                                    <Form.Control onChange={handleInput} value={priceFunction(order?.total) ?? ""} name="TotalPrice" step="0.01" className="form-input"/>
                                    <p className="form-label"></p>
                                    <p className="mt-2 form-input ps-0">Total = Subtotal + Shipping Cost + Tax </p>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="paymentMethod">
                                    <Form.Label className="form-label">Payment Method:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.paymentMethod ?? ""} name="paymentMethod" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="orderStatus">
                                    <Form.Label className="form-label">Status:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.orderStatus ?? ""} name="orderStatus" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="orderTime">
                                    <Form.Label className="form-label">Order Date:</Form.Label>
                                    <div className="form-input ps-3">{formatDate(order?.orderTime) ?? ""}</div>
                                    <Form.Control value={formatDate(order?.orderTime) ?? ""} name="orderTime" required type="hidden"/>
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="products" title="Products">
                            {listProducts()}
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <fieldset disabled={updateOrder.type === "View"}>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDays">
                                    <Form.Label className="form-label">Delivery Days:</Form.Label>
                                    <Form.Control onChange={null} value={order?.deliveryDays ?? ""} name="deliveryDays" required className="form-input" disabled/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDate">
                                    <Form.Label className="form-label">Expected Deliver Date:</Form.Label>
                                    <div className="form-input ps-3">{formatDate(order?.deliveryDate) ?? ""}</div>
                                    <Form.Control value={order?.deliveryDate ?? ""} name="deliveryDate" required type="hidden"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                                    <Form.Label className="form-label">First Name:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.firstName ?? ""} name="firstName" className="form-input" type="text"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                                    <Form.Label className="form-label">Last Name:</Form.Label>
                                    <Form.Control onChange={handleInput} name="lastName" className="form-input" type="text" value={order?.lastName ?? ""} />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="phoneNumber">
                                    <Form.Label className="form-label">Phone Number:</Form.Label>
                                    <Form.Control onChange={handleInput} name="phoneNumber" className="form-input" value={order?.phoneNumber ?? ""}/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="mainAddress">
                                    <Form.Label className="form-label">Address Line 1:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.mainAddress ?? ""} name="mainAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="extraAddress">
                                    <Form.Label className="form-label">Address Line 2:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.extraAddress} name="extraAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="city">
                                    <Form.Label className="form-label">City:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.city} name="city" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="state">
                                    <Form.Label className="form-label">State:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.state} name="state" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="country">
                                    <Form.Label className="form-label">Country:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.country} name="country" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="postalCode">
                                    <Form.Label className="form-label">Postal Code:</Form.Label>
                                    <Form.Control onChange={handleInput} value={order?.postalCode} name="postalCode" step="0.01" required className="form-input" />
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="track" title="Track">
                        </Tab>
                    </Tabs>
                    {(updateOrder.type === "Edit") && <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0 my-3">
                            <Button ref={submitBtnRef} className="fit-content mx-1" variant="primary" type="submit">
                                Save
                            </Button>
                        </div>
                        </Row>
                    }      
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default EditOrder;