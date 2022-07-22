import { Col, Row } from "react-bootstrap";
import { getShortName } from "../utilities";

const Review = ({ review, showUpdate, setDeleteReview, showCustomer, type, showProduct, showReview }) => {

    function deleteReview() {
        setDeleteReview({
            show:true, id: review.id
        })
    }
    function tableItem() {
        return (
            <tr>
                <td>{review.id}</td>
                <td>
                    <span
                        onClick={() => showProduct(review.id)}
                        className="text-primary action cursor-pointer">
                    {getShortName(review.product.name, 60)}
                    </span>
                </td>
                <td>
                    <span
                        onClick={() => showCustomer(review.id)}
                        className="text-primary action cursor-pointer">
                    {review.customer.fullName}
                    </span>
                </td>
                <td>{review.rating} &nbsp; <i className="bi bi-star"></i></td>
                <td>{review.formattedTime}</td>
                <td className="d-flex justify-content-center">
                    <i className="bi bi-journal-text view" title="view details" onClick={() => showReview(review.id)}></i>
                    <i className="bi bi-pencil-fill edit" title="edit review" onClick={()=> showUpdate("Edit",review.id)}></i>
                    <i className="bi bi-archive-fill delete" title="delete review" onClick={deleteReview}></i>
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
                            onClick={() => showProduct(review.id)}
                            className="text-primary text-start action cursor-pointer mb-3 d-inline-block">
                        {getShortName(review.product.name, 60)}
                        </div>
                    <div className="d-flex justify-content-start">
                        <span className="d-block mb-3 me-2">{review.rating} &nbsp; <i className="bi bi-star"></i></span>
                        <i className="bi bi-journal-text view fs-4 ms-2 me-3" title="view details" onClick={() => showReview(review.id)}></i>
                        <i className="bi bi-pencil-fill edit fs-6 mx-3" title="edit review" onClick={()=> showUpdate("Edit",review.id)}></i>
                        <i className="bi bi-archive-fill delete fs-6 ms-3 me-2" title="delete review" onClick={deleteReview}></i>
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