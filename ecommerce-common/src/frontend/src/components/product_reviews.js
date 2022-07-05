import { useCallback, useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import axios from "axios";
import { SPINNERS_BORDER, listReviews } from "./utilities";
import MyPagination from "./orders/paging";
import StarRatings from 'react-star-ratings';
import useSettings from "./use-settings";

const ProductReviews = ({ show, setShow, id, product }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null, numberPerPage: 1
    });

    const {DECIMAL_DIGIT} = useSettings();
    
    const changePage = useCallback(function (abortController, number) {
        number = number ?? 1;
        const url = process.env.REACT_APP_SERVER_URL + `p/${id}/reviews/${pageInfo.number}`;
        setLoading(true);
        axios.get(url, { signal: abortController.signal})
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
                setReviews(data.reviews);
            })
            .catch(error => {
                const response = error?.response; 
                console.log(response)
                console.log("An error ocurred");
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, pageInfo.number])

    useEffect(() => {
        const abortController = new AbortController();
        changePage(pageInfo.number, abortController)
        return () => abortController.abort();
    }, [changePage, pageInfo.number])

    return (
      <Modal show={show} fullscreen={true} onHide={() => setShow(!show)}>
        <Modal.Header closeButton>
                <Modal.Title>Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border" style={{width: "90%"}}>
            
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "40vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
                         <Row className="justify-content-center p-4 mx-0">
                            <Col sm={9} md={4}>
                                <img src={product.path} 
                                alt="product" className="main-image" />
                            </Col>
                            <Col sm={11} md={8} className="text-start">
                                <h2 className="fw-bold mt-2">{product.name}</h2>
                                <div className = "d-flex justify-content-start align-items-center my-2">
                                    <StarRatings 
                                        starDimension="20px"
                                        starSpacing="5px" rating={product.averageRating}
                                        starRatedColor="yellow" name='product rating' />
                                     <div className="ms-2">{product.averageRating.toFixed(DECIMAL_DIGIT)} of 5</div>
                                </div>
                                <div>{product.reviewCount} rating(s)</div>
                            </Col>
                        </Row> 
                        <Row className="justify-content-center p-4 mx-0" style={{minHeight: '300px'}}>
                            {listReviews(reviews)}
                        </Row>
                        
                        {(reviews.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""} 
                    </>
            }
                </>
        </Modal.Body>
    </Modal>
    );
}
 
export default ProductReviews;