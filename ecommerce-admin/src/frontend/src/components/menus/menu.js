import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Menu = ({ menu, showUpdate, setDeleteMenu, updateStatus, type, showArticle, movePosition }) => {

    function deleteMenu() {
        setDeleteMenu({
            show:true, id: menu.id
        })
    }
    
    const enabled = menu.enabled
        ? <i 
            onClick={()=> updateStatus(menu.id, false)} 
            className="bi bi-check-circle-fill text-success fs-3"></i>
        : <i 
            onClick={()=> updateStatus(menu.id, true)} 
            className="bi bi-circle text-secondary fs-3"></i>

    const position = <div className="d-flex flex-wrap justify-content-start ps-2">
        {
            (menu.position > 1) && 
                <i onClick={e=>movePosition(e, menu.id, 'up')} className="bi bi-chevron-up text-secondary fs-4 me-3" title="move up"></i>
        }
        <span>{menu.position}</span>
        <i onClick={e=>movePosition(e, menu.id, 'down')} className="ms-3 bi bi-chevron-down text-secondary fs-4" title="move down"></i>
    </div>

    function tableItem() {
        return (
            <tr>
                <td>{menu.id}</td>
                <td>{getShortName(menu.title, 60)}</td>
                <td>{menu.type}</td>
                <td className="hideable-col">
                    <span className="cursor-pointer text-primary" onClick={()=>showArticle(menu.id)}>
                        {menu.article.title}
                    </span>
                </td>
                <td>{enabled}</td>
                <td>{position}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-pencil-fill edit" title="edit menu" onClick={()=> showUpdate("Edit",menu.id)}></i>
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
                        <span>{menu.id}</span>
                    </div>
                </Col>
                <Col xs="8">
                    <div
                            className="text-start mb-2 d-inline-block">
                        {getShortName(menu.title)}
                    </div>
                    <div className="d-flex flex-wrap justify-content-start align-item-center">
                        <span className="d-block mb-3">{enabled}</span>
                        <i className="bi bi-pencil-fill edit fs-6 mx-3" title="edit menu" onClick={()=> showUpdate("Edit",menu.id)}></i>
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
 
export default Menu;