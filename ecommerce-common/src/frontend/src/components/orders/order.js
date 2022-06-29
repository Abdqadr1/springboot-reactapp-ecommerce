import { Card, Col } from "react-bootstrap";
import { formatDate } from "../utilities";
import { Link } from "react-router-dom";

const Order = ({ order, type, showView, priceFunction, setOrderStatus }) => {

  function hasStatus(status){
    return order.orderTracks.some(track => track.status === status.toUpperCase())
  }

  function listProducts() {
    return order.orderDetails.map(d => <li key={d.id}><Link to={"/p/"+d.product.alias}>{d.product.name}</Link></li>)
  }

  function showUpdateModal(e) {
    setOrderStatus(s => ({
      ...s,
      show: true,
      id: order.id
    }))
  }
    
  function tableItem() {
      return (
        <tr>
          <td>{order.id}</td>
          <td>{formatDate(order.orderTime, "short", "medium")}</td>
          <td><ul className="text-start" style={{maxWidth: "60vw"}}>{listProducts()}</ul></td>
          <td>{priceFunction(order.total)}</td>
          <td className="">{order.orderStatus}</td> 
          <td className="d-flex justify-content-center">
          
            <i title="view details"
              className="bi bi-file-earmark-richtext-fill fs-3 cs text-success mx-2" 
              onClick={() => showView(order.id)}></i>
              {
                (!hasStatus("RETURNED")) && !hasStatus("RETURN_REQUESTED") &&
                  <i title="return" 
                    onClick={showUpdateModal} 
                    className="fs-3 text-secondary bi bi-arrow-counterclockwise mx-2"></i>
              }
          </td>
          
          
          
        </tr>
      );
  }

  function shipperItem(){
    return (
      <Col xs={11} md={5} className="my-2">
          <Card className="text-start my-2">
              <Card.Header className="px-3 d-flex justify-content-between align-items-center">
                <span className="fw-bold">Order ID #{order.id}</span>
                <div>
                  <i title="view details" className="bi bi-file-earmark-richtext-fill fs-3 cs text-success mx-2" 
                    onClick={() => showView(order.id)}></i>
                    {
                      (!hasStatus("RETURNED")) && !hasStatus("RETURN_REQUESTED") &&
                        <i title="return" 
                          onClick={showUpdateModal} 
                          className="fs-3 text-secondary bi bi-arrow-counterclockwise mx-2"></i>
                    }
                </div>
                
              </Card.Header>
              <Card.Body className="p-3">
                  <ul className="text-start">{listProducts()}</ul>
                  <div className="d-flex justify-content-between">
                    <div className="mb-1">
                      <p className="mb-1">{priceFunction(order.total)}</p>
                      <p className="mb-1">{formatDate(order.orderTime, "short", "medium")}</p>
                    </div>
                    <span>{order.orderStatus}</span>
                  </div>
                  {
                    (order.paymentMethod === "COD") && 
                    <p>&nbsp;</p>
                  }
              </Card.Body>
          </Card>
      </Col>
    )
  }
    
  const item = (type === "detailed")
    ? tableItem() : shipperItem();
  return item;
}
 
export default Order;
