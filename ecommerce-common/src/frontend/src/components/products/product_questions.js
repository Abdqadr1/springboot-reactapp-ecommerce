import { useCallback, useEffect, useState, useContext, useRef } from "react";
import {  Row, Col } from "react-bootstrap";
import axios from "axios";
import { SPINNERS_BORDER, listQuestions, isTokenExpired } from "../utilities";
import MyPagination from "../orders/paging";
import { AuthContext } from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";
import { useParams } from "react-router";
import MessageModal from "../message_modal";
import { Link } from "react-router-dom";

const ProductQuestions = () => {
    const { id } = useParams();
    const loadRef = useRef();
    const { auth, setAuth } = useContext(AuthContext);
    const { array: questions, setArray: setQuestions, updateArray: updateQuestions } = useArray();
    const [isLoading, setLoading] = useState(false);
    const [sort, setSort] = useState("votes");
    const [product, setProduct] = useState({});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null, numberPerPage: 1
    });
    const handleSort = e => {
        const newSort = e.target.id;
        if (sort === newSort) return;
        pageInfo.number = 1;
        setSort(newSort)
    }
    
    const changePage = useCallback(function (abortController, number, head) {
        number = number ?? 1;
        const url = process.env.REACT_APP_SERVER_URL + `p/${Number(id)}/questions/${pageInfo.number}?sortField=${sort}`;
        setLoading(true);
        axios.get(url, {
            headers:{...head},
            signal: abortController.signal
        })
        .then(response => {
            const data = response.data;
            setProduct(data.product);
            setQuestions(data.questions);
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
        })
        .catch(error => {
            if (isTokenExpired(error?.response)) setAuth(null);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [id, pageInfo.number, setAuth, setQuestions, sort])

    useEffect(() => {
        document.title = `Product Questions`; 
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const abortController = new AbortController();
        let head = {};
        if (auth && auth?.accessToken) head = { "Authorization": `Bearer ${auth.accessToken}` };
        changePage(pageInfo.number, abortController, head)
        
        return () => abortController.abort();
    }, [auth, changePage, pageInfo.number]);

    const update = (item, message) => {
        updateQuestions(item);
        setMessage(s=> ({...s,show:true, title: "Vote Question", message}))
    }


    return (
            
         <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
                         <Row className="justify-content-center p-2 mx-0">
                            <Col sm={3} md={2}>
                                <img src={product?.mainImagePath} 
                                alt="product" className="main-image-product" />
                            </Col>
                            <Col sm={11} md={8} className="text-start">
                                <h4 className="fw-bold mt-2">{product?.name}</h4>
                                <div className="d-flex flex-wrap justify-content-start align-items-center my-2">
                                    <Link className="me-1" id="votes" to="#" onClick={handleSort}>Sort by most voted</Link>
                                    <Link className="ms-1" id="askTime" to="#" onClick={handleSort}>Sort by most recent</Link>
                                </div>
                            </Col>
                        </Row>  
                        <Row className="justify-content-center p-2 mx-0" style={{ minHeight: '300px' }}>
                            {
                                (questions.length > 0)
                                ? listQuestions(questions, update, { auth, setAuth })
                                : <h4 className="text-center">No approved questions</h4>
                            }
                        </Row>
                        
                        {(questions.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""} 
                    </>
            }
            <MessageModal obj={message} setShow={setMessage} />
        </>
    );
}
 
export default ProductQuestions;