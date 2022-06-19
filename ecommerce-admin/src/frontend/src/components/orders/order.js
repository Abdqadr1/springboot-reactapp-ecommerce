import { Col, Row } from "react-bootstrap";
import { formatDate } from "../utilities";

const Order = ({ order, showUpdate, setDeleted, type, showView, showCustomer, priceFunction }) => {

    function deleteOrder() {
        setDeleted({
            show:true, id: order.id
        })
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
                onClick={() => showUpdate(order.id)}
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
            <Col xs="5" className="fw-bold text-center">{order.id}</Col>
            <Col xs="7">
              <span className="d-block my-1">{order.firstName} {order.lastName}, {order.country}</span>
              <span className="d-block my-1">{formatDate(order.orderTime)} - {order.orderStatus}</span>
              <span className="d-block my-1">{priceFunction(order.total)} - {order.paymentMethod}</span>
              <div className="d-flex justify-content-start">
                      <i 
                        className="bi bi-journal-text view mx-2"
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
                        onClick={() => showUpdate(order.id)}
                      ></i>
              </div>
              
            </Col>
          </Row>
        );
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Order;
