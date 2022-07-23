import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useRef,useEffect } from "react";
const RegisterSuccess = () => {
    const loadRef = useRef();
    
    useEffect(() => {
        loadRef?.current?.focus();
    }, [])
    
    return (
        <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            <Container className="mt-5">
                <h2 className="mt-5">Customer Registration</h2>
                <h3>You have successfully registered as a customer.</h3>
                <p>Please check your email to verify your account.</p>
                <Container>
                    <Link to="/login" className="btn btn-success">Login Here</Link>
                </Container>
            </Container>
        </>
        
     );
}
 
export default RegisterSuccess;