import { Modal, Alert, Row, Col, Form, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { listProducts, SPINNERS_BORDER_HTML } from "../utilities";
import axios from "axios";
import useAuth from "../custom_hooks/use-auth";
import "../../css/products.css";
import MyPagination from "../paging";
const ProductSearchModal = ({ show, setShow, priceFunction, selectHandler }) => {
    const [{ accessToken }] = useAuth();
    const [alertRef, keywordRef, submitBtnRef] = [useRef(), useRef(), useRef()];
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
     const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const url = `${process.env.REACT_APP_SERVER_URL}orders/product_search/page/`

    useEffect(() => {
        if (!keyword) return;
        const abortController = new AbortController();
        const btn = submitBtnRef.current;
        const text = btn.textContent;
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        const data = new FormData(); data.set("keyword", keyword)
        axios.post(`${url}${pageInfo.number}`, data, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            signal: abortController.signal
        })
        .then(res => {
            const data = res.data;
            setProducts(data.products);
            setPageInfo(state => (
                {
                    ...state,
                    endCount: data.endCount,
                    startCount: data.startCount,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    numberPerPage: data.numberPerPage
                }
            ))
        }).catch(err => {
            console.log(err);
            const message = err.response.data.message;
            setAlert(s=>({...s, show:true, message}))
        }).finally(() => {
            btn.disabled = false;
            btn.textContent = text;
        })
        return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[pageInfo.number, keyword])

    const handleSubmit = (e) => {
        e.preventDefault();
        const keyword = keywordRef.current;
        pageInfo.number = 1;
        setKeyword(keyword.value);
    }
    


    return ( 
        <Modal show={show} fullscreen={true} onHide={()=>setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className="border product_search_modal">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={()=>setAlert({...alert, show: false})}>
                    {alert.message}
                </Alert>
                <Row className="justify-content-start px-3 mx-0 bg-light">
                    <Col md={4}>
                        <Form className="my-2 col-12" onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={9} md={9}>
                                    <Form.Control ref={keywordRef} placeholder="keyword" required minLength="3" />
                                </Col>
                                <Col xs={2} md={2}>
                                    <Button ref={submitBtnRef} variant="success" type="submit">Search</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                {listProducts(products, keyword, priceFunction, selectHandler)}
                {(products.length > 0) && <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> }
            </Modal.Body>
      </Modal>
     );
}
 
export default ProductSearchModal;