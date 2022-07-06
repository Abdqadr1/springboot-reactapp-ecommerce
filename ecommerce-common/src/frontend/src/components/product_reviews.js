import { useCallback, useEffect, useState, useContext } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { SPINNERS_BORDER, listReviews, isTokenExpired } from "./utilities";
import MyPagination from "./orders/paging";
import StarRatings from 'react-star-ratings';
import useSettings from "./use-settings";
import { AuthContext } from "./custom_hooks/use-auth";
import useArray from "./custom_hooks/use-array";

const ProductReviews = ({ show, setShow, id, product }) => {
    const { auth, setAuth } = useContext(AuthContext);
    const { array: revs, setArray: setRevs, updateArray: updateReviews } = useArray();
    const [isLoading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null, numberPerPage: 1
    });

    const {DECIMAL_DIGIT} = useSettings();
    
    const changePage = useCallback(function (abortController, number, head) {
        number = number ?? 1;
        const url = process.env.REACT_APP_SERVER_URL + `p/${id}/reviews/${pageInfo.number}`;
        setLoading(true);
        axios.get(url, {
            headers:{...head},
            signal: abortController.signal
        })
            .then(response => {
                const data = response.data;
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
                setRevs(data.reviews);
            })
            .catch(error => {
                const response = error?.response; 
                console.log(response);
                if (isTokenExpired(error?.response)) setAuth(null);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, pageInfo.number, setAuth, setRevs])

    useEffect(() => {
        const abortController = new AbortController();
        if (show) {
            let head = {};
            if (auth && auth?.accessToken) head = { "Authorization": `Bearer ${auth.accessToken}` };
            changePage(pageInfo.number, abortController, head)
        }
        
        return () => abortController.abort();
    }, [auth, changePage, pageInfo.number, show]);


    return (
      <Modal show={show} fullscreen={true} onHide={() => setShow(!show)}>
        <Modal.Header closeButton>
                <Modal.Title>Customer Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border" style={{width: "90%"}}>
            
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
                         <Row className="justify-content-center p-4 mx-0">
                            <Col sm={9} md={3}>
                                <img src={product.path} 
                                alt="product" className="main-image" />
                            </Col>
                            <Col sm={11} md={8} className="text-start">
                                <h4 className="fw-bold mt-2">{product.name}</h4>
                                <div className = "d-flex justify-content-start align-items-center my-2">
                                    <StarRatings 
                                        starDimension="20px"
                                        starSpacing="5px" rating={product.averageRating}
                                        starRatedColor="yellow" name='product rating' />
                                     <div className="ms-2">{product.averageRating.toFixed(DECIMAL_DIGIT)} of 5</div>
                                </div>
                                <div>{product.reviewCount} rating(s)</div>
                                {
                                    (product.reviewedByCustomer) &&
                                    <div className="mt-1 text-success">You already reviewed this product</div>
                                }
                            </Col>
                        </Row> 
                        <Row className="justify-content-center p-4 mx-0" style={{minHeight: '300px'}}>
                            {listReviews(revs, updateReviews, { auth, setAuth })}
                        </Row>
                        
                        {(revs.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""} 
                    </>
            }
                </>
        </Modal.Body>
    </Modal>
    );
}
 
export default ProductReviews;