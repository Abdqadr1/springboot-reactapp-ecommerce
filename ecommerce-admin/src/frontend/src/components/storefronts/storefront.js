import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Storefront = ({storefront, showUpdate, setDeleteMenu, updateStatus, type, movePosition }) => {

    function deleteMenu() {
        setDeleteMenu({
            show:true, id: storefront.id
        })
    }
    
    const enabled = storefront.enabled
        ? <i 
            onClick={()=> updateStatus(storefront.id, false)} 
            className="bi bi-check-circle-fill text-success fs-3"></i>
        : <i 
            onClick={()=> updateStatus(storefront.id, true)} 
            className="bi bi-circle text-secondary fs-3"></i>

    const position = <div className="d-flex flex-wrap justify-content-start ps-2">
        {
            (storefront.position > 1) && 
                <i onClick={e=>movePosition(e, storefront.id, 'up')} className="bi bi-arrow-up-circle-fill text-primary fs-5 me-3" title="move up"></i>
        }
        <span>{storefront.position}</span>
        <i onClick={e=>movePosition(e, storefront.id, 'down')} className="ms-3 bi bi-arrow-down-circle-fill text-primary fs-5" title="move down"></i>
    </div>

    function tableItem() {
        return (
            <tr>
                <td>{storefront.id}</td>
                <td>{getShortName(storefront.heading, 60)}</td>
                <td>{storefront.type}</td>
                <td>{position}</td>
                <td>{enabled}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit menu" onClick={()=> showUpdate("Edit",storefront.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete menu" onClick={deleteMenu}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="4" className="text-center fw-bold">
                    <div>
                        <span>{storefront.id}</span>
                    </div>
                </Col>
                <Col xs="8">
                    <div
                            className="text-start mb-2 d-inline-block">
                        {getShortName(storefront.heading)}
                    </div>
                    <div className="d-flex flex-wrap justify-content-start align-item-center">
                        <span className="d-block mb-3">{enabled}</span>
                        <i className="bi bi-pencil-fill edit fs-6 mx-3" title="edit menu" onClick={()=> showUpdate("Edit",storefront.id)}></i>
                        <i className="bi bi-archive-fill delete fs-6 mx-3" title="delete menu" onClick={deleteMenu}></i>
                    </div>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Storefront;