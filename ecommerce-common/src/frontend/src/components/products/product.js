import axios from "axios";
import { useEffect, useRef, useState, useContext } from "react";
import { Row, Col, Breadcrumb, Button, Form, FloatingLabel} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import MyCarousel from "./image-carousel";
import { getShortName, formatPrice, listReviews, isTokenExpired, SPINNERS_BORDER,SPINNERS_BORDER_HTML, listQuestions } from "../utilities";
import useSettings from "../use-settings";
import Search from "../search";
import { Stock } from '../cart/stock';
import StarRatings from 'react-star-ratings';
import { AuthContext } from "../custom_hooks/use-auth";
import ReviewForm from "../review_s.js/review_form";
import useArray from "../custom_hooks/use-array";
import MessageModal from "../message_modal";

const Product = () => {
    const { alias } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [reviewsRef, questionsRef] = [useRef(), useRef()];
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState({ show:false, message:"", title: ""});
    const {array: reviews, setArray: setReviews, updateArray: updateReviews} = useArray();
    const {array: questions, setArray: setQuestions, updateArray: updateQuestions} = useArray();
    const [showReviewForm, setShowReviewForm] = useState({show: false, product: {}});
    const { auth, setAuth } = useContext(AuthContext);
    const abortController = useRef(new AbortController());
    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE,SITE_NAME } = useSettings();

    useEffect(()=>{document.title = `${alias} - ${SITE_NAME}`},[SITE_NAME, alias])

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    const [showCarousel, setShowCarousel] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const bigImageRef = useRef();

    useEffect(() => {
        abortController.current = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "p/alias/" + alias;
        let head = {};
        if (auth && auth?.accessToken) head = { "Authorization": `Bearer ${auth.accessToken}` };
        setLoading(true);
        axios.get(url, {
            headers:{...head},
            signal: abortController.current.signal
        })
            .then(res => {
                const data = res.data;
                setProduct(data.product);
                setReviews(data.reviews);
                setQuestions(data.questions);
                setShowReviewForm(s => ({ ...s, product: data.product }));
            }).catch(err => {
                if (isTokenExpired(err?.response)) setAuth(null);
            }).finally(()=>setLoading(false))
        return () => abortController.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alias])

    
    const update = (item, message) => {
        updateReviews(item);
        setMessage(s=> ({...s,show:true, title: "Vote Review", message}))
    }
    const updateQ = (item, message) => {
        updateQuestions(item);
        setMessage(s=> ({...s,show:true, title: "Vote Question", message}))
    }

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        const target = e.target;
        const data = new FormData(target);
        const btn = target.querySelector("button");
        const text = btn.textContent;
        btn.disabled = true;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        const url = process.env.REACT_APP_SERVER_URL + "question/save";
        axios.post(url, data, {
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`
            },
            signal: abortController.current.signal
        })
        .then(() => {
            setMessage(s => ({
                ...s,
                show: true, title: "Question", message: "Your question has been posted and waiting for approval"
            }))
        }).catch(err => {
            if (isTokenExpired(err?.response)) setAuth(null);
            setMessage(s => ({
                ...s,
                show: true, title: "Question", message: "An error ocurred, Try again"
            }))
        }).finally(() => {
            btn.disabled = false;
            btn.textContent = text;
        })
        
    }

    function breadCrumbs() {
        if(product){
            const cat = product.category
            let currentCat = {...cat};
            const ret = [];
            while (currentCat.parent != null) {
                ret.unshift(
                    <Breadcrumb.Item
                        key={currentCat.name}
                        className="my-2 fs-5"
                        linkAs={Link}
                        linkProps={{ to: `/c/${currentCat.alias}` }}
                    >
                        {currentCat.alias}
                    </Breadcrumb.Item>
                );
                currentCat = currentCat.parent;
            } 
            ret.unshift(
                <Breadcrumb.Item
                    key={currentCat.name}
                    className="my-2 fs-5"
                    linkAs={Link}
                    linkProps={{ to: `/c/${currentCat.alias}` }}
                >
                    {currentCat.alias}
                </Breadcrumb.Item>
                );
            ret.push(
              <Breadcrumb.Item
                key={alias}
                className="my-2 fs-5"
                active={true}
              >
                {getShortName(alias, 60)}
              </Breadcrumb.Item>
            );
            return (
                <>
                    <Breadcrumb className="secondary ps-2">
                        <Breadcrumb.Item className="my-2 fs-5" linkAs={Link} linkProps={{to: "/"}}>Home</Breadcrumb.Item>
                        {ret}
                    </Breadcrumb>
                </>
            )
        }
        
    }

    function listDetails(){
        if(product.details.length > 0){
            return product.details.map((detail, i) => (
              <div key={i} className="text-start my-1">
                <span className="fw-bold text-start">{detail.name}:</span>
                <span className="text-start mx-2">{detail.value}</span>
              </div>
            ));
        }
        return "";
    }

    function showBigImage(){
        setShowCarousel(true);
    }

    function showImage(i){
        const img = bigImageRef.current;
        const images = [product.mainImagePath, ...product.extraImages.map(m => m.imagePath)];
        img.src = images[i];
        setImageIndex(i)
    }

    function listImages(images){
        return (
            <div className="d-flex justify-content-start my-2" style={{flexWrap: "wrap"}}>
                {images.map((img,i) => {
                    return (<div key={i} className="mx-2 border border-secondary rounded p-1 mt-2" onClick={()=>showImage(i)}>
                        <img src={img} alt="product" className="small-img" />
                    </div>)
                    }
                )}
            </div>
        )
    }

    function listProduct(){
        if(product){
            const images = [product.mainImagePath, ...product.extraImages.map(m => m.imagePath)]
            const discountPrice = priceFormatter()(product.realPrice);
            return (
                <>
                    <Row className="justify-content-center p-4 mx-0">
                        <Col sm={9} md={5}>
                            <img ref={bigImageRef} src={product.mainImagePath} 
                            alt="product" className="main-image" onClick={showBigImage} data-index={imageIndex} />
                            {listImages(images)}
                        </Col>
                        <Col sm={9} md={5}>
                            <h2 className="text-start fw-bold mt-2">{product.name}</h2>
                            <div className = "d-flex flex-wrap justify-content-start align-items-center my-2">
                                <StarRatings 
                                    starDimension="1.8em"
                                    starSpacing="5px" rating={product.averageRating}
                                    starRatedColor="yellow" name='product rating' />
                                <div className="ms-2 fw-bold d-flex flex-wrap">
                                    <span
                                        onClick={() => reviewsRef.current.focus()}
                                        className="text-primary cs">
                                        {product.reviewCount} rating(s)
                                    </span>
                                    <span
                                        onClick={() => questionsRef.current.focus()}
                                        className="ms-2 text-primary cs">
                                        {product.questionCount} answered question(s)
                                    </span>
                                </div>
                            </div>
                            <p className="text-start fs-6 mb-1">Brand {product.brand.name}</p>
                            {(product.discountPrice > 0)
                                ? <>
                                    <p className="text-start fs-6 mb-1">List price <del>{priceFormatter()(product.price)}</del></p>
                                    <p className="text-start fs-5 mb-1">
                                        Price 
                                        <span className="text-danger mx-1 fw-bold">{discountPrice}</span>
                                        <span className="mx-2 fs-6 fw-bold">({product.discountPrice}% off)</span>
                                    </p>
                                </> 
                                : <>
                                    <p className="text-start fs-6 mb-1">List price <span className="fw-bold">{priceFormatter()(product.price)}</span></p>
                                </>
                            }
                            <p className="text-start fs-6 mb-1" dangerouslySetInnerHTML={{__html: product.shortDescription}}></p>
                        </Col>
                        <Col sm={9} md={2}>
                            {(product.inStock) ? <Stock id={product.id} /> : <p className="fw-bold text-danger">Out of stock</p> }
                        </Col>
                    </Row>  
                    <hr className="bg-secondary" style={{height: '2px'}} />
                    <div className="px-3 p1-2">
                        <h5 className="text-start mb-4 fw-bold">Product Description</h5>
                            <p className="text-start fs-6 mb-1" dangerouslySetInnerHTML={{__html: product.fullDescription}}></p>
                    </div>
                    <hr className="bg-secondary" style={{height: '2px'}} />
                    <div className="px-3 py-1">
                        <h5 className="text-start mb-3 fw-bold">Product Details</h5>
                        {listDetails()}
                    </div>
                    <hr className="bg-secondary" style={{height: '2px'}} />
                    <div className="px-3 p1-2 text-start" ref={questionsRef} tabIndex={-4}>
                        <h5 className="text-start mb-3 fw-bold">Questions & answers for this product</h5>
                        <Row className="justify-content-center justify-content-md-start mx-0 my-2">
                            {listQuestions(questions, updateQ, {auth, setAuth})}
                        </Row>
                        {
                            (questions.length > 0) && 
                            <Link to={"/product_questions/"+product.id} className="text-primary"> View all question(s) </Link>
                        }
                        {
                            (auth?.accessToken)
                                ?
                                <Form className="row justify-content-center justify-content-md-start" onSubmit={handleSubmitQuestion}>
                                    <FloatingLabel controlId="floatingTextarea" className="my-3 col-11 col-md-7" label="ask a question">
                                        <Form.Control style={{ height: '110px'}} className="py-1" as="textarea" 
                                            name="questionContent" placeholder="ask a question" required maxLength="300" minLength="10" />
                                    </FloatingLabel>
                                    <input type="hidden" name="product" value={product.id} />
                                    <div className="ms-2 px-2 pt-md-3 col-md-3 col-11">
                                        <Button className="d-inline align-bottom" variant="primary" type="submit">Submit</Button>
                                    </div>
                                </Form>
                                : 
                                <div className = "d-flex justify-content-start align-items-center my-2">
                                    <Button
                                        onClick={
                                            () => setMessage(s => ({
                                                ...s,
                                                show: true, title: "Question", message: "You need to login to ask questions"
                                            }))
                                        }
                                        className="ms-2" variant="secondary">Ask a Question</Button>
                                </div>
                        }
                    </div>
                    <hr className="bg-secondary" style={{height: '2px'}} />
                    <div className="px-3 p1-2 text-start" ref={reviewsRef} tabIndex={-2}>
                        <h5 className="text-start mb-3 fw-bold">Customer Reviews:</h5>
                        <div className = "d-flex justify-content-start align-items-center my-3">
                            <StarRatings 
                                starDimension="2em"
                                starSpacing="5px" rating={product.averageRating}
                                starRatedColor="yellow" name='product rating' />
                            <div className="ms-2">{product.averageRating.toFixed(DECIMAL_DIGIT)} of 5</div>
                        </div>
                        <div className="ps-2">{product.averageRating.toFixed(DECIMAL_DIGIT)} rating</div>
                        {
                            (product.reviewCount > 0) && <div className="text-start">
                                <Link to={"/product_reviews/"+product.id}>View all {product.reviewCount} rating(s)</Link>
                            </div>
                        }
                        {
                            (!product.reviewedByCustomer && product.customerCanReview) &&
                            <div className="mt-1">
                                    <span className="text-info">You purchased and got this product</span> &nbsp;
                                    <strong className="text-primary cs" onClick={()=> setShowReviewForm(s=>({...s, show:true}))}>Write your review now</strong>
                            </div>
                        }
                        {
                            (product.reviewedByCustomer) &&
                            <div className="mt-1 text-success">You already reviewed this product</div>
                        }
                                
                        <Row className="justify-content-center justify-content-md-start mx-0 my-2">
                            {listReviews(reviews, update, {auth, setAuth})}
                        </Row>
                    </div>
                    
                    <MyCarousel imageIndex={imageIndex} showCarousel={showCarousel} setShowCarousel={setShowCarousel} items={images} id={product.id} />
                    <ReviewForm show={showReviewForm} setShow={setShowReviewForm}/>
                </>
                
            )
        }
        return "";
    }

    return ( 
         
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : 
                        <>
                            <Search />
                            {breadCrumbs()}
                            {listProduct()}
                        </>
            }
            <MessageModal obj={message} setShow={setMessage} />
        </>
        
     );
}
 
export default Product;