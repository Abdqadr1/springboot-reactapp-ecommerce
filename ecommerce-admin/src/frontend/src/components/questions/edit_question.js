import { Form, Modal, FloatingLabel, Row, Button, Alert } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../custom_hooks/use-auth";
import { SPINNERS_BORDER_HTML, isTokenExpired, listFormData } from "../utilities";
import axios from "axios";

const EditQuestion = ({ data, setData, updateQuestion }) => {
    const url = process.env.REACT_APP_SERVER_URL + "question/edit";
    const question = data.question;
    const [{ accessToken }] = useAuth();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const alertRef = useRef();
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }
    
    const hideModal = () => {
        setData({...data, show: false})
    }
    useEffect(() => {
        setAlert(s => ({ ...s, show: false }))
    }, [data.show]);

    useEffect(() => {
        alertRef.current && alertRef.current.focus()
    }, [alert])
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const target = event.target
        const data = new FormData(target);
        
        listFormData(data);

        setAlert((state) => ({ ...state, show: false }));
         const button = target.querySelector("button");
        button.disabled = true
        const text = button.textContent;
        button.innerHTML = SPINNERS_BORDER_HTML
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
            .then(response => {
                updateQuestion(response.data);
                setAlert({ show: true, message: "Question saved!" })
            })
            .catch(error => { 
                const response = error.response
                if(isTokenExpired(response)) navigate("/login/2")
                else setAlert({show:true, message: response.data.message, variant: "danger"})
            }).finally(() => {
                button.disabled=false
                button.innerHTML = text;
            })
    }

    const handleReset = () => {}
    return ( 
        <Modal show={data.show} fullscreen={true} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Question (ID : {question.id})</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border my-modal-body">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form  className="add-user-form" onSubmit={handleSubmit}>
                    <input value={question?.id ?? ""} type="hidden" name="id" />
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="product">
                        <Form.Label className="form-label">Product:</Form.Label>
                        <Form.Control readOnly value={question.product?.name ?? ""} className="form-input"/>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0">
                        <Form.Label className="form-label">Question:</Form.Label>
                        <div className="form-input px-0">
                            <FloatingLabel
                                controlId="floatingTextarea"
                                className="mb-1"
                            >
                                <Form.Control required name="questionContent" style={{ height: 'fit-content' }}
                                    className="py-1" as="textarea" defaultValue={question.questionContent ?? ""} />
                            </FloatingLabel>
                            <div>Asked by <strong>{question.asker?.fullName ?? ""}</strong> on {question?.formattedAskTime}</div>
                        </div>
                    </Form.Group>
                    <Form.Group className="my-3 row justify-content-center mx-0" controlId="answer">
                        <Form.Label className="form-label">Answer:</Form.Label>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            className="mb-3 form-input px-0"
                        >
                            <Form.Control maxLength="400" style={{ height: 'fit-content' }} name="answerContent" className="py-1" as="textarea"
                                defaultValue={question?.answerContent ?? ""} />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3 row justify-content-center" controlId="enabled">
                        <Form.Label className="form-label">Approved:</Form.Label>
                        <Form.Check name="approvalStatus" defaultChecked={question?.approvalStatus} className="form-input ps-0" type="checkbox"/>
                    </Form.Group>
                    <Row className="justify-content-center">
                        <div className="w-25"></div>
                        <div className="form-input ps-0 my-3">
                            <Button className="fit-content mx-1" variant="primary" type="submit">
                                Save
                            </Button>
                            <Button onClick={handleReset}  className="fit-content mx-1" variant="secondary" type="reset">
                                Clear
                            </Button>
                        </div>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
     );
}
 
export default EditQuestion;