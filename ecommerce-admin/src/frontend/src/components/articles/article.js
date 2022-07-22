import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Article = ({ article, showUpdate, setDeleteArticle, updateStatus, type, showArticle }) => {

    function deleteArticle() {
        setDeleteArticle({
            show:true, id: article.id
        })
    }
    
    const published = article.published
        ? <i 
            onClick={()=> updateStatus(article.id, false)} 
            className="bi bi-check-circle-fill text-success fs-3"></i>
        : <i 
            onClick={()=> updateStatus(article.id, true)} 
            className="bi bi-circle text-secondary fs-3"></i>

    function tableItem() {
        return (
            <tr>
                <td>{article.id}</td>
                <td>{getShortName(article.title, 60)}</td>
                <td>{article.articleType}</td>
                <td>{article.user.fullName}</td>
                <td>{article.formattedUpdatedTime}</td>
                <td>{published}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view" title="view details" onClick={() => showArticle(article.id)}></i>
                    <i className="bi bi-pencil-fill edit" title="edit article" onClick={()=> showUpdate("Edit",article.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete article" onClick={deleteArticle}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="3" className="text-center fw-bold">
                    <div>
                        <span>{article.user.fullName}</span>
                    </div>
                </Col>
                <Col xs="8">
                    <div
                            className="text-start mb-2 d-inline-block">
                        {getShortName(article.title)}
                    </div>
                    <div className="ms-2">{article.formattedUpdatedTime}</div>
                    <div className="d-flex flex-wrap mt-2 justify-content-start align-item-center">
                        <i className="bi bi-journal-text view fs-2 ms-2 me-2" title="view details" onClick={() => showArticle(article.id)}></i>
                        <span className="d-block me-2 fs-6 me-2">{published}</span>
                        <i className="bi bi-pencil-fill edit fs-6 me-3" title="edit article" onClick={()=> showUpdate("Edit",article.id)}></i>
                        <i className="bi bi-archive-fill delete fs-6 me-3" title="delete article" onClick={deleteArticle}></i>
                    </div>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Article;