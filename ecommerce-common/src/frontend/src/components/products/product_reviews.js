import { useCallback, useEffect, useState, useContext } from "react";
import {  Row, Col } from "react-bootstrap";
import axios from "axios";
import { SPINNERS_BORDER, listReviews, isTokenExpired } from "../utilities";
import MyPagination from "../orders/paging";
import StarRatings from 'react-star-ratings';
import useSettings from "../use-settings";
import { AuthContext } from "../custom_hooks/use-auth";
import useArray from "../custom_hooks/use-array";
import { useParams } from "react-router";
import MessageModal from "../message_modal";
import { Link } from "react-router-dom";

const ProductReviews = () => {
    const { id } = useParams();
    const { auth, setAuth } = useContext(AuthContext);
    const { array: revs, setArray: setRevs, updateArray: updateReviews } = useArray();
    const [isLoading, setLoading] = useState(false);
    const [sort, setSort] = useState("votes");
    const [product, setProduct] = useState({});
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null, numberPerPage: 1
    });

    const { DECIMAL_DIGIT } = useSettings();
    const handleSort = e => {
        const newSort = e.target.id;
        if (sort === newSort) return;
        pageInfo.number = 1;
        setSort(newSort)
    }
    
    const changePage = useCallback(function (abortController, number, head) {
        number = number ?? 1;
        const url = process.env.REACT_APP_SERVER_URL + `p/${Number(id)}/reviews/${pageInfo.number}?sortField=${sort}`;
        setLoading(true);
        axios.get(url, {
            headers:{...head},
            signal: abortController.signal
        })
            .then(response => {
                const data = response.data;
                setProduct(data.product);
                setRevs(data.reviews);
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
                const response = error?.response; 
                console.log(response);
                if (isTokenExpired(error?.response)) setAuth(null);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, pageInfo.number, setAuth, setRevs, sort])

    useEffect(() => {
        const abortController = new AbortController();
        let head = {};
        if (auth && auth?.accessToken) head = { "Authorization": `Bearer ${auth.accessToken}` };
        changePage(pageInfo.number, abortController, head)
        
        return () => abortController.abort();
    }, [auth, changePage, pageInfo.number]);

    const update = (item, message) => {
        updateReviews(item);
        setMessage(s=> ({...s,show:true, title: "Vote Review", message}))
    }


    return (
            
         <>
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
                                <div className="d-flex justify-content-start align-items-center my-2">
                                    <Link className="me-1" id="votes" to="#" onClick={handleSort}>Sort by most voted</Link>
                                    <Link className="ms-1" id="reviewTime" to="#" onClick={handleSort}>Sort by most recent</Link>
                                </div>
                                <div className = "d-flex justify-content-start align-items-center my-2">
                                    <StarRatings 
                                        starDimension="2rem"
                                        starSpacing="5px" rating={product?.averageRating}
                                        starRatedColor="yellow" name='product rating' />
                                     <div className="ms-2">{product.averageRating?.toFixed(DECIMAL_DIGIT)} of 5</div>
                                </div>
                                <div>{product?.reviewCount} rating(s)</div>
                                {
                                    (product?.reviewedByCustomer) &&
                                    <div className="mt-1 text-success">You already reviewed this product</div>
                                }
                            </Col>
                        </Row> 
                        <Row className="justify-content-center p-2 mx-0" style={{minHeight: '300px'}}>
                            {
                                (revs.length > 0)
                                ? listReviews(revs, update, { auth, setAuth })
                                : <h4 className="text-center">No product reviews</h4>
                            }
                        </Row>
                        
                        {(revs.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""} 
                    </>
            }
            <MessageModal obj={message} setShow={setMessage} />
        </>
    );
}
 
export default ProductReviews;