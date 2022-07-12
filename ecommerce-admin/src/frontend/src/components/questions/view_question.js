import { Form, Modal, FloatingLabel} from "react-bootstrap";

const ViewQuestion = ({ data, setData }) => {
    const question = data.question;
    
    const hideModal = () => {
        setData({...data, show: false})
    }
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Question Details (ID : {question.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border my-modal-body">
                {(question.approvalStatus)
                    ? <div className="fw-bold text-success text-center">This question was approved</div>
                    : <div className="fw-bold text-warning text-center">This question has not been approved</div>
                }
                <fieldset disabled>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="product">
                        <Form.Label className="form-label">Product:</Form.Label>
                        <Form.Control readOnly value={question.product?.name ?? ""} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="question">
                        <Form.Label className="form-label">Question:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" readOnly value={question.questionContent ?? ""}  />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="asker">
                        <Form.Label className="form-label">Asked by:</Form.Label>
                        <Form.Control readOnly value={question.asker?.fullName ?? ""} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="">
                        <Form.Label className="form-label">Ask Time:</Form.Label>
                        <Form.Control readOnly value={question?.formattedAskTime ?? ""}  className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="votes">
                        <Form.Label className="form-label">Votes:</Form.Label>
                        <Form.Control readOnly value={question?.votes ?? ""} name="password" className="form-input"/>
                    </Form.Group>
                </fieldset>
                {(question.isAnswered)
                    ?
                    <>
                        <Form.Group className="my-3 row justify-content-center mx-0" controlId="">
                            <Form.Label className="form-label">Answer:</Form.Label>
                             <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control style={{ height: 'fit-content' }} className="py-1" as="textarea" readOnly value={question?.answerContent ?? ""}  />
                        </FloatingLabel>
                        </Form.Group>
                        
                        <Form.Group className="my-3 row justify-content-center mx-0" controlId="answerer">
                            <Form.Label className="form-label">Answered by:</Form.Label>
                            <Form.Control readOnly value={question.answerer?.fullName ?? ""} className="form-input"/>
                        </Form.Group>
                        <Form.Group className="my-3 row justify-content-center mx-0" controlId="votes">
                            <Form.Label className="form-label">Answer Time:</Form.Label>
                            <Form.Control readOnly value={question?.formattedAnswerTime ?? ""} className="form-input"/>
                        </Form.Group>  
                    </>
                    : <div className="fw-bold text-warning text-center">This question has not been answered</div>
                }
            </Modal.Body>
        </Modal>
     );
}
 
export default ViewQuestion;