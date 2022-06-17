import { Col, Row } from "react-bootstrap";

const ShippingRate = ({ rate, showUpdate, setDeleteRate, toggleCOD, type }) => {

    function deleteCustomer() {
        setDeleteRate({
            show:true, id: rate.id
        })
    }

    const cod = rate.cod
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleCOD(rate.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleCOD(rate.id, true)}></i>
    
    function tableItem() {
        return (
            <tr>
                <td className="hideable-col">{rate.id}</td>
                <td>{rate.country.name}</td>
                <td className="hideable-col">{rate.state}</td>
                <td>{rate.rate}</td>
                <td>{rate.days}</td>
                <td>{cod}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit rate" onClick={()=> showUpdate("Edit",rate.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete rate" onClick={deleteCustomer}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="5" className="text-center fw-bold">
                    <div>{rate.country.name}</div>
                    <div>{rate.state}</div>
                </Col>
                <Col xs="7">
                    <span className="d-block mb-3">{rate.days} days</span>
                    <Row className="justify-content-start align-item-center">
                        <Col xs="3">{cod}</Col>
                        <Col xs="3"><i className="bi bi-pencil-fill edit fs-6" title="edit rate" onClick={()=> showUpdate("Edit",rate.id)}></i></Col>
                        <Col xs="3"><i className="bi bi-archive-fill delete fs-6" title="delete rate" onClick={deleteCustomer}></i></Col>
                    </Row>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default ShippingRate;