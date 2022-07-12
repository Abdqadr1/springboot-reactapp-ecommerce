import { useEffect, useState, useContext } from "react";
import { Modal, Row, Col, Form, Button, FloatingLabel } from "react-bootstrap";
import axios from "axios";
import { isTokenExpired, listFormData, SPINNERS_BORDER_HTML } from "./utilities";
import StarRatings from 'react-star-ratings';
import { AuthContext } from "./custom_hooks/use-auth";
import CustomToast from "./custom_toast";

const ReviewForm = ({ show, setShow }) => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_SERVER_URL + "review/save";
    const product = show.product;
    const [readOnly, setReadOnly] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "" })
    const [rating, setRating] = useState(0);
    const { auth, setAuth } = useContext(AuthContext);


    useEffect(() => {
        setReadOnly(false);
        return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        const target = e.target;
        const btn = target.querySelector("button");
        const data = new FormData(target);
        listFormData(data);
        const text = btn.textContent;
        btn.disabled = true; 
        btn.innerHTML = SPINNERS_BORDER_HTML;
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`
            },
            signal: abortController.signal
        })
            .then(res => {
                product.customerCanReview = false;
                product.reviewedByCustomer = true;
                setReadOnly(true);
            }).catch(err => {
                console.log(err);
                if (isTokenExpired(err?.response)) setAuth(null);
                setToast({show: true, message: "Could not submit review"})
            }).finally(() => {
                btn.disabled = false;
                btn.textContent = text;
            })
    }

    const reduceStar = () => {
        if (!readOnly) {
            setRating(rating > 0 ? rating - 1 : 0);
        }
    }
    const setStar = (e) => {
        if (!readOnly) {
            setRating(e);
        }
    }

    return (
      <Modal show={show.show} fullscreen={true} onHide={() => setShow(s=>({...s, show:false}))}>
        <Modal.Header closeButton>
                <Modal.Title className="text-center">Write Product Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border" style={{width: "90%"}}>
            <Row className="justify-content-center p-4 mx-0">
                <Col sm={9} md={3}>
                    <img src={product?.mainImagePath} 
                    alt="product" className="main-image" />
                </Col>
                <Col sm={11} className="text-start">
                    <h3 className="fw-bold mt-3 text-center">{product?.name}</h3>
                    
                </Col>
            </Row>
            {(readOnly) && <div className="text-success my-2 fs-5 text-center">Your review has been posted</div>} 
            <Form onSubmit={handleSubmit} className="p-4 border border-3 rounded">
                        <div className = "d-flex justify-content-center align-items-center my-3">
                            {(!readOnly) && <i onClick={reduceStar} className="bi bi-dash-square cs text-info fs-5 d-block mx-2"></i>}
                            <StarRatings name="review_rating" isSelectable={true} starDimension="2em"
                                starRatedColor="yellow" starHoverColor="yellow" changeRating={setStar}
                                starSpacing="5px" rating={rating}
                                />
                        </div>
                        <input name="rating" value={rating} type="hidden" required />
                        <input name="product" value={product?.id} type="hidden" required />
                        <Form.Control readOnly={readOnly} name="headline"  placeholder="headline" required maxLength="100" minLength="10" />
                        <FloatingLabel controlId="floatingTextarea" className="my-3 px-0" label="Comment">
                            <Form.Control readOnly={readOnly} style={{ height: '110px' }} className="py-1" as="textarea" 
                                name="comment" placeholder="comment" required maxLength="300" minLength="10" />
                        </FloatingLabel>
                        <Button disabled={readOnly} variant="primary" className="mx-auto d-block" type="submit">Post Review</Button>
                    </Form>
            <CustomToast {...toast} setToast={setToast} position="bottom-end" />
        </Modal.Body>
    </Modal>
    );
}
 
export default ReviewForm;