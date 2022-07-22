import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Question = ({ question, showUpdate, setDeleteQuestion, showCustomer, type, showProduct, showQuestion }) => {

    function deleteQuestion() {
        setDeleteQuestion({
            show:true, id: question.id
        })
    }

    const answered = question.isAnswered
        ? <i className="bi bi-check-circle-fill text-success fs-3"></i>
        : <i className="bi bi-circle text-secondary fs-3"></i>;
    
    const approved = question.approvalStatus
        ? <i className="bi bi-check-circle-fill text-success fs-3"></i>
        : <i className="bi bi-circle text-secondary fs-3"></i>

    function tableItem() {
        return (
            <tr>
                <td>{question.id}</td>
                <td>
                    <span
                        onClick={() => showProduct(question.id)}
                        className="text-primary action cursor-pointer">
                    {getShortName(question.product.name, 60)}
                    </span>
                </td>
                <td>{getShortName(question.questionContent, 40)}</td>
                <td>
                    <span
                        onClick={() => showCustomer(question.id)}
                        className="text-primary action cursor-pointer">
                    {question.asker.fullName}
                    </span>
                </td>
                <td>{question.formattedAskTime}</td>
                <td>{approved}</td>
                <td>{answered}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view" title="view details" onClick={() => showQuestion(question.id)}></i>
                    <i className="bi bi-pencil-fill edit" title="edit question" onClick={()=> showUpdate("Edit",question.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete question" onClick={deleteQuestion}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="3" className="text-center fw-bold">
                    <div>
                        <span>{question.id}</span>
                    </div>
                </Col>
                <Col xs="9">
                    <div
                            className="text-start mb-2 d-inline-block">
                        {getShortName(question.product.name, 60)}
                    </div>
                    <div
                         className="text-start mb-3 d-inline-block">
                        {getShortName(question.questionContent, 60)}
                    </div>
                    <div className="ms-2">{question.formattedAskTime}</div>
                    <div className="d-flex justify-content-start align-item-center mt-2">
                        <i className="bi bi-journal-text view fs-2 me-2" title="view details" onClick={() => showQuestion(question.id)}></i>
                        <span className="d-block mx-2">{approved}</span>
                        <i className="bi bi-pencil-fill edit fs-6 mx-3" title="edit question" onClick={()=> showUpdate("Edit",question.id)}></i>
                        <i className="bi bi-archive-fill delete fs-6 mx-3" title="delete question" onClick={deleteQuestion}></i>
                    </div>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Question;