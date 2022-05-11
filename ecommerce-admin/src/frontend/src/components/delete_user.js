import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { SPINNERS_BORDER } from "./utilities";

const DeleteModal = ({ deleteUser, setDeleteUser, deletingUser }) => {
        
    const [confirm, setConfirm] = useState("Confirm");
    function hideModal() {
        setDeleteUser({
            ...deleteUser,
            show: false
        })
    }
    function del() {
        setConfirm(SPINNERS_BORDER);
        deletingUser()
    }

    useEffect(() => {
        setConfirm("Confirm")
    }, [deleteUser.show])

    return ( 
         <Modal show={deleteUser.show}>
            <Modal.Header closeButton={false}>
                <Modal.Title>Delete User (ID: {deleteUser.id})</Modal.Title>
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