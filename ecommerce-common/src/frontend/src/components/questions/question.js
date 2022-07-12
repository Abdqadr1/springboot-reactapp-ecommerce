import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Question = ({ question, type, showQuestion }) => {
    const showProduct = () => {
        window.open("/#/p/" + question.product.alias,'_blank');
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
                        onClick={showProduct}
                        className="text-primary action cursor-pointer">
                    {getShortName(question.product.name, 60)}
                    </span>
                </td>
                <td>{question.questionContent}</td>
                <td>{question.formattedAskTime}</td>
                <td>{approved}</td>
                <td>{answered}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view fs-3" title="view details" onClick={() => showQuestion(question.id)}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="5" className="text-center fw-bold">
                    <div>
                        <span>{question.id}</span>
                    </div>
                </Col>
                <Col xs="7">
                    <div
                        onClick={showProduct}
                            className="text-start mb-3 d-inline-block">
                        {getShortName(question.questionContent, 60)}
                    </div>
                    <div
                            className="text-start mb-3 d-inline-block">
                        {getShortName(question.questionContent, 60)}
                    </div>
                    <div className="ms-2">{question.formattedAskTime}</div>
                    <div className="d-flex justify-content-start align-item-center">
                        <span className="d-block mb-3">{approved}</span>
                        <i className="bi bi-journal-text view fs-2 ms-4 me-2" title="view details" onClick={() => showQuestion(question.id)}></i>
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