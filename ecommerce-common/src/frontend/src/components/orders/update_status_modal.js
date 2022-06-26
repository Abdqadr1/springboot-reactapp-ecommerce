import { useEffect,useRef, useMemo,useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { SPINNERS_BORDER_HTML} from "../utilities";
const UpdateStatusModal = ({ object, setObject, updatingFunc }) => {
    const [btnRef, cancelBtnRef] = [useRef(), useRef()];
    const [message, setMessage] = useState(null);
    const content = useMemo(() => {
        return <>
            <div>Reason: </div>
            <Form.Check required label="I bought the wrong items" name="reason" type="radio" value="I bought the wrong items" />
            <Form.Check required label="I received the wrong items" name="reason" type="radio" value="I received the wrong items" />
            <Form.Check required label="The product was damaged or defective" name="reason" type="radio" value="The product was damaged or defective" />
            <Form.Check required label="The product arrived too late" name="reason" type="radio" value="The product arrived too late" />
            <Form.Control as="textarea" name="note" className="mt-3"/>
        </>
    }, [])

    useEffect(() => {
        object.show && setMessage(null);
    }, [object.show])
    function hideModal() {
        setObject({
            ...object,
            show: false
        })
    }
    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const btn = btnRef.current;
        const cancelBtn = cancelBtnRef.current;
        btn.disabled = true; cancelBtn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        updatingFunc(data, (message, success) => {
            btn.textContent = "Submit Request";
            btn.disabled = false;
            cancelBtn.disabled = false;
            setMessage(<div className="text-center">{message}</div>);
        })
    }

    return ( 
         <Modal show={object.show} onHide={hideModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Return Order ID #{object.id}</Modal.Title>
            </Modal.Header>
            <Form className="add-user-form" onSubmit={handleSubmit}>
                <Modal.Body style={{ maxWidth: "100%" }}>
                    {message ?? content}
                </Modal.Body>

                <Modal.Footer>
                    {
                        (!message) && <Button variant="success" ref={btnRef} type="submit">Submit Request</Button>
                    }
                    <Button variant="danger" ref={cancelBtnRef} type="button" onClick={hideModal}>Cancel</Button>
                </Modal.Footer>
            </Form>
        </Modal>
     );
}
 
export default UpdateStatusModal;