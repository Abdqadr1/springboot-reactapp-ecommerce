import { Card, Col, Row } from "react-bootstrap";
import { formatDate, hasThisNotThese } from "../utilities";
import useAuth from "../custom_hooks/use-auth";

const Order = ({ order, setDeleted, type, showView, showEdit, showCustomer, priceFunction, setOrderStatus }) => {
  const [auth] = useAuth();

  function deleteOrder() {
      setDeleted({
          show:true, id: order.id
      })
  }

  function hasStatus(status){
    return order.orderTracks.some(track => track.status === status.toUpperCase())
  }

  function showUpdateModal(e) {
    const type = e.target.title.toUpperCase();
    setOrderStatus(s => ({
      ...s,
      show: true,
      id: order.id,
      type
    }))
  }
    
  function tableItem() {
      return (
        <tr>
          <td>{order.id}</td>
          <td>
            <span
              onClick={() => showCustomer(order.id)}
              className="text-primary action cursor-pointer">{order.firstName} {order.lastName}
            </span>
          </td>
          <td>{priceFunction(order.total)}</td>
          <td>{formatDate(order.orderTime)}</td>
          <td className="hideable-col">{order.city}, {order.state}, {order.country}.</td>
          <td className="hideable-col">{order.paymentMethod}</td> 
          <td className="hideable-col">{order.orderStatus}</td> 
          <td className="d-flex justify-content-center">
            <i 
              className="bi bi-journal-text view"
              title="view details"
              onClick={() => showView(order.id)}
              ></i>
          <i
              className="bi bi-pencil-fill edit"
              title="edit order"
              onClick={() => showEdit(order.id)}
              ></i>
          <i
              className="bi bi-archive-fill delete"
              title="delete order"
              onClick={deleteOrder}
          ></i> 
          </td>
          
          
          
        </tr>
      );
  }

  function rowItem() {
      return (
        <Row className="mt-2 justify-content-between">
          <Col xs="3" className="fw-bold text-center">{order.id}</Col>
          <Col xs="9">
            <span className="d-block my-1">{order.firstName} {order.lastName}, {order.country}</span>
            <span className="d-block my-1">{formatDate(order.orderTime)} - {order.orderStatus}</span>
            <span className="d-block my-1">{priceFunction(order.total)} - {order.paymentMethod}</span>
            <div className="d-flex justify-content-start">
                    <i 
                      className="bi bi-journal-text view ms-0 me-2 fs-4"
                      title="view details"
                      onClick={() => showView(order.id)}
                    ></i>
                          <i
                            className="bi bi-archive-fill delete fs-6 mx-2"
                            title="delete order"
                            onClick={deleteOrder}
                          ></i>
                    <i
                      className="bi bi-pencil-fill edit fs-6 mx-2"
                      title="edit order"
                      onClick={() => showEdit(order.id)}
                    ></i>
            </div>
            
          </Col>
        </Row>
      );
  }

    function shipperItem(){
      return (
        <Col xs={11} md={5} className="my-2">
            <Card className="text-start my-2">
                <Card.Header className="px-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Order ID #{order.id}</span>
                  <i title="view details" className="bi bi-file-earmark-richtext-fill fs-3 cs text-success" onClick={() => showView(order.id)}></i>
                </Card.Header>
                <Card.Body className="p-3">
                    <p><i className="bi bi-person-fill"></i>&nbsp;<strong>{order.firstName} {order.lastName}</strong></p>
                    <p>
                      <i className="bi bi-house-fill"></i>&nbsp;
                      {`${order.mainAddress}, ${order.extraAddress}, ${order.city}, ${order.state}, ${order.country}, ${order.postalCode}`}
                    </p>
                    <p><i className="bi bi-telephone-fill"></i> &nbsp;{order.phoneNumber}</p>
                    {
                      (order.paymentMethod === "COD") && 
                      <p>{order.paymentMethod}&nbsp;<span className="fw-bold">{priceFunction(order.total)}</span></p>
                    }
                    <div className="d-flex justify-content-around">
                      <i title="picked" 
                          onClick={!hasStatus("picked") ? showUpdateModal : null} 
                          className={`cs fs-3 ${hasStatus("picked") ? 'text-success' : 'text-secondary'} bi bi-basket3-fill`}></i>
                      <i title="shipping" 
                          onClick={!hasStatus("shipping") ? showUpdateModal : null} 
                          className={`cs fs-3 ${hasStatus("shipping") ? 'text-success' : 'text-secondary'} bi bi-truck`}></i>
                      <i title="delivered" 
                          onClick={!hasStatus("delivered") ? showUpdateModal : null} 
                          className={`cs fs-3 ${hasStatus("delivered") ? 'text-success' : 'text-secondary'} bi bi-box2-fill`}></i>
                      <i title="returned" 
                          onClick={!hasStatus("returned") ? showUpdateModal : null} 
                          className={`cs fs-3 ${hasStatus("returned") ? 'text-success' : 'text-secondary'} bi bi-arrow-counterclockwise`}></i>
                    </div>
                </Card.Body>
            </Card>
        </Col>
      )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

  if (hasThisNotThese(auth, "Shipper", ["Admin", "SalesPerson"])) return shipperItem();
  return item;
}
 
export default Order;
