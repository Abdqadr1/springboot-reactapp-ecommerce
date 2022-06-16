import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SPINNERS_BORDER } from "./utilities";

const DeleteModal = ({ deleteObject, setDeleteObject, deletingFunc, type }) => {
        
    const [confirm, setConfirm] = useState("Confirm");
    function hideModal() {
        setDeleteObject({
            ...deleteObject,
            show: false
        })
    }
    function del() {
        setConfirm(SPINNERS_BORDER);
        deletingFunc()
    }

    useEffect(() => {
        setConfirm("Confirm")
    }, [deleteObject.show])

    return ( 
         <Modal show={deleteObject.show}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Delete {type} {deleteObject.id + 1}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>This action cannot be undone.</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>Cancel</Button>
                <Button variant="danger" onClick={del}>{confirm}</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default DeleteModal;