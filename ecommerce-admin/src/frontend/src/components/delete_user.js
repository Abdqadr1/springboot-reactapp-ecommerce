import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

const DeleteModal = ({ deleteUser, setDeleteUser, deletingUser }) => {
    const spinner = <Spinner animation="border" size="sm" />
        
    const [confirm, setConfirm] = useState("Confirm");
    function hideModal() {
        setDeleteUser({
            ...deleteUser,
            show: false
        })
    }
    function del() {
        setConfirm(spinner);
        deletingUser()
    }

    useEffect(() => {
        setConfirm("Confirm")
    }, [deleteUser.show])

    return ( 
         <Modal show={deleteUser.show}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Delete User</Modal.Title>
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