import { Col, Row } from "react-bootstrap";

const Customer = ({ customer, showUpdate, setDeleteCustomer, toggleEnable, type }) => {

    function deleteCustomer() {
        setDeleteCustomer({
            show:true, id: customer.id
        })
    }

    const enabled = customer.enabled
        ? <i className="bi bi-toggle-on text-success fs-3" onClick={() => toggleEnable(customer.id, false)}></i>
        : <i className="bi bi-toggle-off text-secondary fs-3" onClick={() => toggleEnable(customer.id, true)}></i>
    
    function tableItem() {
        return (
            <tr>
                <td>{customer.id}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td className="hideable-col">{customer.email}</td>
                <td>{customer.country.name}</td>
                <td className="hideable-col">{customer.state}</td>
                <td className="hideable-col">{customer.city}</td>
                <td>{enabled}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view" title="view details" onClick={() => showUpdate("View",customer.id)}></i>
                    <i className="bi bi-pencil-fill edit" title="edit customer" onClick={()=> showUpdate("Edit",customer.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete customer" onClick={deleteCustomer}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="5" className="text-center fw-bold">
                    <div>{customer.firstName}</div>
                    <div>{customer.lastName}</div>
                </Col>
                <Col xs="7">
                    <span className="d-block mb-3">{customer.country.name}</span>
                    <div className="d-flex justify-content-start align-item-center">
                        {enabled}
                        <i className="bi bi-journal-text view fs-2 ms-4 me-2" title="view details" onClick={() => showUpdate("View",customer.id)}></i>
                        <i className="bi bi-pencil-fill edit fs-6 mx-3" title="edit customer" onClick={()=> showUpdate("Edit",customer.id)}></i>
                        <i className="bi bi-archive-fill delete fs-6 mx-3" title="delete customer" onClick={deleteCustomer}></i>
                    </div>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Customer;