import { ToastContainer, Toast } from "react-bootstrap";
const CustomToast = ({ show, position, setToast, message, variant }) => {
  const text = !variant || variant !== "dark" ? "text-dark" : "text-light";
    return ( 
        <ToastContainer className="p-3" position={position ?? "middle-center"} style={{zIndex: 999999999000}}>
          <Toast bg={variant ?? "dark"} onClose={() => setToast(s=>({...s, show:false}))} show={show} delay={3000} autohide>
            {/* <Toast.Header closeButton={false}>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header> */}
            <Toast.Body className={text + " text-center"}>{message ?? ""}</Toast.Body>
          </Toast>
        </ToastContainer>
     );
}
 
export default CustomToast;