import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Review = ({ review, type, showReview }) => {
    const showProduct = () => {
        window.open("/#/p/" + review.product.alias,'_blank');
    }

    function tableItem() {
        return (
            <tr>
                <td>{review.id}</td>
                <td>
                    <span
                        onClick={showProduct}
                        className="text-primary action cursor-pointer">
                    {getShortName(review.product.name, 60)}
                    </span>
                </td>
                <td>{review.headline}</td>
                <td>{review.rating} &nbsp; <i className="bi bi-star"></i></td>
                <td>{review.formattedTime}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view fs-3" title="view details" onClick={() => showReview(review.id)}></i>
                </td>
            </tr>
        )
    }

    function rowItem() {
        return (
            <Row className="mt-2 justify-content-between">
                <Col xs="3" className="text-center fw-bold">
                    <div>
                        <span>{review.id}</span>
                    </div>
                </Col>
                <Col xs="9">
                        <div
                            onClick={showProduct}
                            className="text-primary text-start action cursor-pointer mb-3 d-inline-block">
                        {getShortName(review.product.name, 60)}
                        </div>
                    <div className="d-flex justify-content-start align-item-center">
                        <span className="d-block mb-3">{review.rating} &nbsp; <i className="bi bi-star"></i></span>
                        <i className="bi bi-journal-text view fs-2 ms-4 me-2" title="view details" onClick={() => showReview(review.id)}></i>
                    </div>
                </Col>
            </Row>
        )
    }
    
    const item = (type === "detailed")
        ? tableItem() : rowItem()

    return item
}
 
export default Review;