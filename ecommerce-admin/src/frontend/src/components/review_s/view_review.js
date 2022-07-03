import { Form, Modal, FloatingLabel} from "react-bootstrap";

const ViewReview = ({ data, setData }) => {
    const review = data.review;
    
    const hideModal = () => {
        setData({...data, show: false})
    }

    // const handleInput = (event) => {
    //     setForm({
    //         ...review,
    //         [event.target.id]: event.target.value
    //     })
    // }

    // const handleSelect = (e, which) => {
    //     if (which === "c") {
    //         const id = Number(e.target.value);
    //         const country = countries.find(c => c.id === id);
    //         setCountry({ ...country })
    //         setForm(s=>({...s, country}))
    //     } else if (which === "s") {
    //         const state = e.target.value;
    //         setState(state)
    //         setForm(s=>({...s, state}))
    //     }
    // }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>View Review (ID : {review.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border modal-body">
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