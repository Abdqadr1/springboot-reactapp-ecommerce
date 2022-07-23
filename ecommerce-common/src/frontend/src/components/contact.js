import "../css/contact.css";
import { Breadcrumb, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listFormData } from "./utilities";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
const Contact = () => {
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const [alertRef, loadRef] = [useRef(), useRef()];

     useEffect(() => {
        document.title = "Contact";
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!alert.show) return;
        alertRef.current && alertRef.current.focus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert]);


    const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-light" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`

    
    const handleSubmit = e => {
        e.preventDefault();
        const target = e.target;
        const data = new FormData(target);
        listFormData(data);
        const button = target.querySelector("button");
        const text = button.innerHTML;
        button.disabled = true;
        button.innerHTML = SPINNERS_BORDER_HTML;
        const url = `${process.env.REACT_APP_SERVER_URL}contact`;
        axios.post(url, data)
            .then(res => {
                setAlert({show:true, message :"Message sent successfully", variant: "success"})
            })
            .catch(err => {
                const data = err.response.data;
                const msg = data?.message;
                setAlert({ show: true, message: msg ?? "Something went wrong, try again", variant: "danger" });
                target.reset();
            })
            .finally(() => {
                button.disabled = false; 
                button.innerHTML = text;
            })
    }


    return ( 
        <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            <div className="position-relative">
                <header className="header bg-dark">
                    <div className="d-flex flex-column justify-content-start">
                        <h1 className="fw-bold text-light">Contact Us</h1>
                        <Breadcrumb className="bread">
                            <Breadcrumb.Item className="fs-4 text-light" linkAs={Link} linkProps={{to: "/"}}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item className="fs-4 text-light" linkAs={Link} linkProps={{to: "/contact"}}>Contact</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </header>
                <Row className="mx-0 justify-content-md-start justify-content-center contact ps-md-5">
                    <Col sm="12" md="2" className="p-0">
                        <div className="d-flex flex-wrap mt-2 mb-4 mb-md-0 justify-content-center justify-content-md-start">
                            <a className="text-white my-2" href="https://www.linkedin.com/in/abolarinwa-quadri-a08b39144" target="blank"><i className="bi bi-linkedin me-3 fs-6"></i></a>
                            <a className="text-white my-2" href="https://twitter.com/olaleyone" target="blank"><i className="bi bi-twitter me-3 fs-6"></i></a>
                            <a className="text-white my-2" href="https://web.facebook.com/abolarinwa.quadri" target="blank"><i className="bi bi-facebook me-3 fs-6"></i></a>
                            <a className="text-white my-2" href="https://wa.me/2348115213342" target="blank"><i className="bi bi-whatsapp me-3 fs-6"></i></a>
                        </div>
                    </Col>
                    <Col sm="12" md="9" className="bg-white px-0 shadow-lg rounded">
                        <Row className="mx-0 justify-content-center p-5 px-4">
                            <Col sm="12" md="7">
                                <Form method="post" onSubmit={handleSubmit}>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <i className="bi bi-person-rolodex fs-3 me-2"></i>
                                        <h4 className="ms-2 fw-bold">Get In Touch</h4>
                                    </div>
                                    <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible
                                        onClose={() => setAlert(s => ({ ...s, show: false }))} className="my-3">
                                        {alert.message}
                                    </Alert>
                                    <Form.Control className="field" name="name" type="text" placeholder="Your Name" required maxLength="64"/>
                                    <Form.Control className="field" name="email" type="email" placeholder="Email Address" required maxLength="64"/>
                                    <textarea name="message" required className="field" placeholder="Message"></textarea>
                                    <Button className="button" variant="dark" type="submit">
                                        <span className="fs-5 me-2">Send Now</span>
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </Button>
                                </Form>
                            </Col>
                            <Col sm="12" md="5" className="ps-5 d-none d-md-block">
                                <div className="border-start ps-4 py-md-5 center">
                                    <div className="d-flex flex-wrap align-items-center mt-3">
                                        <i className="bi bi-envelope-fill me-3"></i>
                                        <span className="flex-grow-1">abolarinwaquadri@gmail.com</span>
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center mt-3">
                                        <i className="bi bi-telephone-fill me-3"></i>
                                        <span className="flex-grow-1">+2348115213342</span>
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center mt-3">
                                        <i className="bi bi-geo-alt-fill me-3"></i>
                                        <span className="flex-grow-1">Ibadan, Oyo State, Nigeria.</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
        
     );
}
 
export default Contact;