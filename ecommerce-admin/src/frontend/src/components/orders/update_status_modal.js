import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SPINNERS_BORDER } from "../utilities";
const UpdateStatusModal = ({ object, setObject, updatingFunc }) => {
     const [confirm, setConfirm] = useState("Yes");
    function hideModal() {
        setObject({
            ...object,
            show: false
        })
    }
    function del() {
        setConfirm(SPINNERS_BORDER);
        updatingFunc();
    }

    useEffect(() => {
        setConfirm("Yes")
    }, [object.show])

    return ( 
         <Modal show={object.show} onHide={hideModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Update Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{minWidth: "100%"}}>
                <h5>Are you sure you want to update status of
                    order ID <span className="fw-bold">#{object.id}</span> to &nbsp;
                    <span className="fw-bold">{object.type.toUpperCase()}</span>?
                </h5>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="success" onClick={del}>{confirm}</Button>
                <Button variant="danger" onClick={hideModal}>No</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default UpdateStatusModal;