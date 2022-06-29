import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

const DeleteModal = ({ deleteObject, setDeleteObject, deletingFunc, type }) => {
        
    const [confirm, setConfirm] = useState("Confirm");
    function hideModal() {
        setDeleteObject({
            ...deleteObject,
            show: false
        })
    }
    function del() {
        setConfirm(<Spinner animation="border" size="sm" />);
        deletingFunc()
    }

    useEffect(() => {
        setConfirm("Confirm")
    }, [deleteObject.show])

    return ( 
         <Modal show={deleteObject.show}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Delete {type}</Modal.Title>
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