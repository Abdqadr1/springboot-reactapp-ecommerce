import { useEffect, useContext, useState, useRef } from "react";
import useSettings from "./use-settings";
import {AuthContext} from "./custom_hooks/use-auth";
import { formatPrice, isTokenExpired, formatDate, getShortName, SPINNERS_BORDER_HTML, listFormData } from "./utilities";
import { useNavigate } from "react-router";
import CustomToast from "./custom_toast";
import axios from "axios";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Paypal from "./paypal";
import LoaderScreen from "./fullscreen-loader";

const Checkout = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_URL + "checkout";
    
    const [toast, setToast] = useState({ show: false, message: "" })
    const [info, setInfo] = useState(null);
    const [isCOD, setCOD] = useState(false);
    const [isPlacedOrder, setPlaceOrder] = useState(false);
    const [fullscreenLoader, setFullscreenLoader] = useState(false);
  const [submitBtnRef] = [useRef()];
    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();
    useEffect(() => { document.title = `Checkout - ${SITE_NAME}` }, [SITE_NAME])
      function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    useEffect(() => {
        const abortController = new AbortController();
        if (auth?.accessToken) {
            axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${auth?.accessToken}`,
                },
                signal: abortController.signal
            })
            .then(res => {
                const data = res.data;
                setInfo(data);
            })
            .catch(res => {
                console.error(res)
                const response = res.response;
                if (isTokenExpired(response)) {
                    setAuth(null); navigate("/login");
                }
                const message = res.response.data.message ?? "An error ocurred, Try again";
                setToast(s=>({...s, show:true, message }))
            })
        } else {
           navigate("/login") 
        }
        return () => {
            abortController.abort();
        }
    }, [auth])

    const checkoutSuccess = (url) => {
        return (
            <>
                <h4 className="pt-5">Your order has been completed!</h4>
                <h5>A confirmation email has been sent to you.</h5>
                <h5>Kindly check your email for details.</h5>
                <h4>
                    <a href={url} className="text-primary">Click here</a>
                     &nbsp; to manage and track your order.</h4>
            </>
        )
    }

    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        const action = form.getAttribute("data-action");
        const data = new FormData(form);
        placeOrder(data, action);
    }
    const placeOrder = (data, action) => {
        listFormData(data);
        setFullscreenLoader(true)
        axios.post(`${url}/${action}`, data, {
            headers: {
                "Authorization": `Bearer ${auth?.accessToken}`
            }
        })
        .then(res => {
            console.log(res)
            setPlaceOrder(true);
            setAuth({ ...auth, cart: 0 })
        })
        .catch(res => {
            const response = res.response;
            if (isTokenExpired(response)) {
                setAuth(null); navigate("/login");
            }
            if(response) setToast(s => ({...s, show:true, message:response.data.message}))
        }).finally(() => {
            setFullscreenLoader(false);
            
        })
    }

    const handleChange = e => { 
        setCOD(!isCOD)
    }

    function show() {
        if (info) {
            return (
                <Row className="justify-content-center mx-0">
                    <Col xs={11} md={7} className="my-2">
                        <Card className="text-start my-2">
                            <Card.Header className="p-3">Shipping Information</Card.Header>
                            <Card.Body className="p-3">
                                <p><strong>ship to: </strong>{info.address} <Link to="/addresses?r=checkout">[ship to another address]</Link></p>
                                <p><strong>Days to deliver: </strong>{info.info.deliveryDays} day(s)</p>
                                <p>
                                    <strong>Expected delivery date: </strong>
                                    {formatDate(info.info.deliveryDate, "full")}
                                </p>
                            </Card.Body>
                        </Card>
                        <Card className="text-start my-3">
                            <Card.Header className="p-3">Payment Information</Card.Header>
                            <Card.Body className="p-3">
                                {
                                    (info.info.codSupported) &&
                                    <>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3 d-flex justify-content-start" controlId="cod">
                                                <Form.Check
                                                    type="checkbox"
                                                    name="paymentMethod"
                                                    value="COD"
                                                    checked={isCOD}
                                                    onChange={handleChange}
                                                    className="my-2 border-dark mx-2"
                                                    label="Cash On Delivery (COD)"
                                                />
                                                {
                                                    (isCOD) && <Button ref={submitBtnRef} variant="primary" type="submit">Place Order with COD</Button>
                                                }
                                            </Form.Group>
                                        </Form>
                                        
                                    </>
                                }
                                <PayPalScriptProvider options={
                                    {
                                        "client-id": info?.paymentId ?? "",
                                        currency: info.currency?.code ?? "",
                                        intent: "capture",
                                        
                                    }
                                }>
                                    <Paypal info={info} setToast={setToast} successHandler={placeOrder} />
                                </PayPalScriptProvider>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={11} md={5} className="my-2">
                        <Card className="text-start my-2">
                            <Card.Header className="p-3">Order Summary</Card.Header>
                            <Card.Body className="p-3">
                                {
                                    info.items.map(item => (
                                        <Row key={item.id} className="mx-0 my-2 border-bottom">
                                            <Col xs={2}>{item.quantity}x</Col>
                                            <Col xs={10}>
                                                <Link to={`/p/${item.product.alias}`}>
                                                    {getShortName(item.product.name, 80)}
                                                </Link> {priceFormatter()(item.subtotal)}
                                                <p> ship: {priceFormatter()(item.shippingCost)}</p>
                                            </Col>
                                        </Row>
                                    ))
                                }
                                <p className="my-2"> Product Total: {priceFormatter()(info.info.productTotal)}</p>
                                <p className="my-2"> Shipping Total: {priceFormatter()(info.info.shippingCostTotal)}</p>
                                <p className="my-2"> Payment Total: <strong>{priceFormatter()(info.info.paymentTotal)}</strong></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )
        } 
        return "";  
    }

    return ( 
        <>
            {(isPlacedOrder)
                ? checkoutSuccess()
                : <>
                   <h3 className="fw-bold my-3">Checkout</h3>
                    {show()}
                    <CustomToast {...toast} setToast={setToast} position="bottom-end" />
                    <LoaderScreen show={fullscreenLoader} />
                </>
            }
            
        </>
     );
}
 
export default Checkout;