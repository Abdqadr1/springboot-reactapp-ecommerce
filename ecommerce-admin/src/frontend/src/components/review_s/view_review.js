import { Form, Modal, FloatingLabel} from "react-bootstrap";

const ViewReview = ({ data, setData }) => {
    const review = data.review;
    
    const hideModal = () => {
        setData({...data, show: false})
    }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Review Details (ID : {review.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border my-modal-body">
                <fieldset disabled>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="firstName">
                        <Form.Label className="form-label">Review ID:</Form.Label>
                        <Form.Control readOnly value={review?.id ?? ""}  name="firstName" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="lastName">
                        <Form.Label className="form-label">Product:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" readOnly value={review.product?.name ?? ""}  />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="email">
                        <Form.Label className="form-label">Customer:</Form.Label>
                        <Form.Control readOnly value={review.customer?.fullName ?? ""}  name="email" type="email" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="password">
                        <Form.Label className="form-label">Headline:</Form.Label>
                        <Form.Control readOnly value={review?.headline ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="rating">
                        <Form.Label className="form-label">Rating:</Form.Label>
                        <Form.Control readOnly value={review?.rating ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="votes">
                        <Form.Label className="form-label">Votes:</Form.Label>
                        <Form.Control readOnly value={review?.votes ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="phoneNumber">
                        <Form.Label className="form-label">Comment:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" readOnly value={review?.comment ?? ""}  />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0">
                        <Form.Label className="form-label">Review Time:</Form.Label>
                        <div className="form-input">{review?.formattedTime ?? ""}</div>
                    </Form.Group>
                </fieldset>
            </Modal.Body>
        </Modal>
     );
}
 
export default ViewReview;