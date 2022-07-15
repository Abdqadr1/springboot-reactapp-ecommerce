import { Modal, Button } from "react-bootstrap";
const MessageModal = ({ obj, setShow }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton={false}>
                    <Modal.Title>{obj.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>{obj.message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}> Close </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default MessageModal;