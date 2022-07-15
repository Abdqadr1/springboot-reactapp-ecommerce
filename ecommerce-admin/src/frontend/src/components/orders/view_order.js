import {useEffect, useState } from "react";
import { Col, Form, Modal, Row, Tab, Tabs, Table } from "react-bootstrap";
import { formatDate, hasAnyAuthority } from "../utilities"
import useThrottle from "../custom_hooks/use-throttle";
import useAuth from "../custom_hooks/use-auth";

const ViewOrder = ({ viewOrder, setViewOrder, priceFunction }) => {
    const order = viewOrder?.order;
    const [auth] = useAuth();
    const [width, setWidth] = useState(window.innerWidth);

    const hideModal = () => setViewOrder(state => ({...state, show:false}));
    
    const handleWindowWidthChange = useThrottle(() => setWidth(window.innerWidth), 500)
      useEffect(() => {
        window.addEventListener("resize", handleWindowWidthChange)
        return () => {
            window.removeEventListener("resize", handleWindowWidthChange)
        }
    })

    const listOrderTracks = () => {
        if (order) {
            if (width >= 769) {
                return (
                    <Table bordered responsive hover className="more-details">
                        <thead className="bg-light text-secondary">
                            <tr>
                                <th>Updated Time</th>
                                <th>Status</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody className="bg-light text-secondary">
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
                        <div className="my-1">{formatDate(track.updatedTime, "short", "medium")}</div>
                        <div className="ms-4 my-"><strong>{track.status}</strong> {track.note}</div>
                    </div>
                )
            }
        }
        return "";
    }

    const listProducts = () => {
        if (order && order.orderDetails?.length > 0) {
            // console.log(order.orderDetails)
            return order.orderDetails.map((detail, i) => (
                <Row className="justify-content-center my-2" key={detail.id}>
                    <Col xs={11} className="p-2 border rounded">
                        <Row className="justify-content-center justify-content-md-center">
                            <Col xs={11} md={5}>
                                <div>{i+1}</div>
                                    <img src={detail.product.mainImagePath} 
                                    alt="product" className="main-image"/>
                            </Col>
                            <Col xs={11} md={6}>
                                <div className="fw-bold my-2">{detail.product.name}</div>
                                {
                                    (hasAnyAuthority(auth, ["Admin", "Salesperson"])) && 
                                    <>
                                        <div className="my-2">Product Cost {priceFunction(detail.productCost)}</div>
                                        <div className="my-2">Subtotal {`${detail.quantity} x ${priceFunction(detail.unitPrice)} = ${priceFunction(detail.subtotal)}`}</div>
                                        <div className="my-2">Shipping Cost {priceFunction(detail.shippingCost)}</div>
                                    </>
                                }
                                
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))
        }
        return "";
    }
    
    return ( 
         
        <Modal show={viewOrder.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>View Order (ID : {order?.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border order_modal_body">
                <Form className="add-user-form">
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="overview" title="Overview">
                            <fieldset disabled={true}>
                                <Form.Group className="mb-3 row justify-content-center" controlId="id">
                                    <Form.Label className="form-label">Order ID:</Form.Label>
                                    <Form.Control readOnly value={order?.id ?? ""} name="id" required className="form-input" disabled/>
                                </Form.Group>
                                {
                                    (hasAnyAuthority(auth, ["Admin", "Salesperson"])) && 
                                    <>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="customer">
                                            <Form.Label className="form-label">Customer:</Form.Label>
                                            <Form.Control readOnly value={`${order?.firstName} ${order?.lastName}` ?? ""} name="customer" className="form-input" type="text"/>
                                        </Form.Group>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="productCost">
                                            <Form.Label className="form-label">Product Cost:</Form.Label>
                                            <Form.Control readOnly name="productCost" className="form-input" type="text" value={priceFunction(order?.productCost) ?? ""} />
                                        </Form.Group>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="subtotal">
                                            <Form.Label className="form-label">Subtotal:</Form.Label>
                                            <Form.Control readOnly name="subtotal" className="form-input" value={priceFunction(order?.subtotal) ?? ""}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="shippingCost">
                                            <Form.Label className="form-label">Shipping Cost:</Form.Label>
                                            <Form.Control readOnly value={priceFunction(order?.shippingCost)} name="shippingCost" step="0.01" required className="form-input" />
                                        </Form.Group>
                                        <Form.Group className="mb-3 row justify-content-center" controlId="tax">
                                            <Form.Label className="form-label">Tax:</Form.Label>
                                            <Form.Control readOnly value={priceFunction(order?.tax )?? ""} name="tax" step="0.01" required className="form-input"/>
                                        </Form.Group>

                                    </>
                                }

                                <Form.Group className="mb-3 row justify-content-center" controlId="total">
                                    <Form.Label className="form-label">Total:</Form.Label>
                                    <Form.Control readOnly value={priceFunction(order?.total) ?? ""} name="TotalPrice" step="0.01" className="form-input"/>
                                    <p className="form-label"></p>
                                </Form.Group>

                                <Form.Group className="mb-3 row justify-content-center" controlId="paymentMethod">
                                    <Form.Label className="form-label">Payment Method:</Form.Label>
                                    <Form.Control readOnly value={order?.paymentMethod ?? ""} name="paymentMethod" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="orderStatus">
                                    <Form.Label className="form-label">Status:</Form.Label>
                                    <Form.Control readOnly value={order?.orderStatus ?? ""} name="orderStatus" required className="form-input"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="orderTime">
                                    <Form.Label className="form-label">Order Date:</Form.Label>
                                    <div className="form-input ps-3">{formatDate(order?.orderTime) ?? ""}</div>
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="products" title="Products">
                            {listProducts()}
                        </Tab>
                        <Tab eventKey="shipping" title="Shipping">
                            <fieldset disabled={true}>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDays">
                                    <Form.Label className="form-label">Delivery Days:</Form.Label>
                                    <Form.Control readOnly value={order?.deliveryDays ?? ""} name="deliveryDays" required className="form-input" disabled/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="deliveryDate">
                                    <Form.Label className="form-label">Expected Deliver Date:</Form.Label>
                                    <div className="form-input ps-3">{formatDate(order?.deliveryDate) ?? ""}</div>
                                    <Form.Control value={order?.deliveryDate ?? ""} name="deliveryDate" required type="hidden"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="firstName">
                                    <Form.Label className="form-label">First Name:</Form.Label>
                                    <Form.Control readOnly value={order?.firstName ?? ""} name="firstName" className="form-input" type="text"/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="lastName">
                                    <Form.Label className="form-label">Last Name:</Form.Label>
                                    <Form.Control readOnly name="lastName" className="form-input" type="text" value={order?.lastName ?? ""} />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="phoneNumber">
                                    <Form.Label className="form-label">Phone Number:</Form.Label>
                                    <Form.Control readOnly name="phoneNumber" className="form-input" value={order?.phoneNumber ?? ""}/>
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="mainAddress">
                                    <Form.Label className="form-label">Address Line 1:</Form.Label>
                                    <Form.Control readOnly value={order?.mainAddress ?? ""} name="mainAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="extraAddress">
                                    <Form.Label className="form-label">Address Line 2:</Form.Label>
                                    <Form.Control readOnly value={order?.extraAddress} name="extraAddress" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="city">
                                    <Form.Label className="form-label">City:</Form.Label>
                                    <Form.Control readOnly value={order?.city} name="city" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="state">
                                    <Form.Label className="form-label">State:</Form.Label>
                                    <Form.Control readOnly value={order?.state} name="state" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="country">
                                    <Form.Label className="form-label">Country:</Form.Label>
                                    <Form.Control readOnly value={order?.country} name="country" step="0.01" required className="form-input" />
                                </Form.Group>
                                <Form.Group className="mb-3 row justify-content-center" controlId="postalCode">
                                    <Form.Label className="form-label">Postal Code:</Form.Label>
                                    <Form.Control readOnly value={order?.postalCode} name="postalCode" step="0.01" required className="form-input" />
                                </Form.Group>
                            </fieldset>
                        </Tab>
                        <Tab eventKey="track" title="Track">
                            {listOrderTracks()}
                        </Tab>
                    </Tabs>
                          
                </Form>
            </Modal.Body>
      </Modal>
     );
}
 
export default ViewOrder;