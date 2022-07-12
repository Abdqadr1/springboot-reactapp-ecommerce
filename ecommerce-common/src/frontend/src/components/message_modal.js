import { Modal, Button } from "react-bootstrap";
const MessageModal = ({ obj, setShow }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
                    <Modal.Title>{obj.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {obj.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default MessageModal;