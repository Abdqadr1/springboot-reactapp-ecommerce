import { ToastContainer, Toast } from "react-bootstrap";
const CustomToast = ({show, position, setToast, message}) => {
    return ( 
        <ToastContainer className="p-3" position={position ?? "middle-center"}>
          <Toast bg="dark" onClose={() => setToast(s=>({...s, show:false}))} show={show} delay={3000} autohide>
            {/* <Toast.Header closeButton={false}>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header> */}
            <Toast.Body className="text-white">{message ?? ""}</Toast.Body>
          </Toast>
        </ToastContainer>
     );
}
 
export default CustomToast;