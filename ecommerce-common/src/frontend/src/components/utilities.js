import { Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import axios from "axios";

export const getShortName = (name, len=60) => {
    if(name.length > len){
        return name.substring(0,len) + "...";
    }
    return name;
}
export const getShort = (name, len = 30) => {
     if(name.length > len){
        return name.substring(0,len);
    }
    return name;
}
export const getPrices = (discount, price, realPrice, formatPrice) => {
    if(discount > 0){
        return (
          <h6 className="text-dark text-start fw-bold" style={{fontSize: '.8em'}}>
            <span>{formatPrice(realPrice)}</span>
            <del className="text-danger mx-2">{formatPrice(price)}</del>
          </h6>
        );
    }
    return (
      <h6 className="text-dark text-start fw-bold" style={{fontSize: '.8em'}}>
        <span>{formatPrice(price)}</span>
      </h6>
    );
}
// export const getDiscountPrice = (discount, price) => {
//     const total = Number(price * (100 - discount) / 100);
//     return total; 
// }

export const formatPrice = (price, s, m, t, pos) => {
    t = t === "COMMA" ? "," : ".";
    if (price || price === 0) {
        const re = '\\d(?=(\\d{3})' + (m > 0 ? '\\.' : '$') + ')';
        const f = price.toFixed(Math.max(0, ~~m)).replace(new RegExp(re, 'g'), '$&' + t);
        if (pos.toLowerCase().startsWith("before")) {
            return `${s}${f}`;
        } else {
            return `${f}${s}`;
        }
    }
    
}

export function listCategories(categories){
    const map = categories.map(cat => {
        const photo = cat.photo && cat.photo !== "null"
        ? <img loading="lazy" src={cat.imagePath} alt={cat.name} className="cat-dp" />
        :<span className="avatar">
            <i className="bi bi-image-fill"></i>
        </span>
        return (
            <Col className="my-3 category-listing" key={cat.name + cat.id} xs={6} sm={4} md={2} lg={2}
                as={Link} to={"/c/" + encodeURIComponent(cat.alias)}>
                    {photo}
                    <h6 className="my-2 text-center">{cat.name}</h6>
            </Col>
        )
    })
    return <Row className="mt-5 px-2 mx-0 justify-content-center justify-content-md-start">{map}</Row>;
}

export function listProducts(results, keyword, type="category", formatPrice){
    let key = "";
    if(results.length > 0){
        if(type){
            key = (type === "category" || type === "brand") 
                    ? <h4 className="py-3">Products  in {type} "{keyword}"</h4>
                    : <h3 className="mt-4 mb-2"> Search Results for "{keyword}"</h3>
        }
        return (
            <>
                {key}
                <Row className="justify-content-start p-4 mx-0">
                    {
                        results.map((p) => (
                            <Col key={p.name} xs={6} sm={4} md={3} lg={2} xlg={2} className="product-in-listing my-2 py-2"
                                as={Link} to={"/p/" + encodeURIComponent(p.alias)}>
                                <img loading="lazy" src={p.mainImagePath} alt={getShortName(p.name, 10)} className="cat-dp" />
                                <h6 className="my-2 text-primary text-start">{getShortName(p.name)}</h6>
                                <div className = "d-flex justify-content-start align-items-center">
                                    <StarRatings 
                                        starDimension=".6rem"
                                        starSpacing=".3em"
                                        rating={p.averageRating}
                                        starRatedColor="yellow"
                                        name='product rating' />
                                    <span className="ms-2" style={{fontSize: ".8em"}} >{p.reviewCount}</span>
                                </div>
                                {getPrices(p.discountPrice, p.price, p.realPrice, formatPrice)}
                            </Col>
                        ))
                    }
                </Row>
            </>
            );
    } else {
        return <h4>No product found for {type} "{keyword}"</h4>
    }
}


    const voteReview = (str, r, updateReviews, ctx) => {
        const { auth, setAuth } = ctx;
        if (auth === null || auth === undefined) {
            updateReviews(r, "You need to login to vote reviews");
            return;
        }
        const url = process.env.REACT_APP_SERVER_URL + "review_vote/vote/" + r.id + "/" + str;
        axios.post(url, null, {
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`
            }
        })
        .then(res => {
            const data = res.data;
            if (data.successful) {
                r.votes = data.voteCount;
                const oldVote = r.customerVote;
                if ((oldVote === 0 && str === 'up') || (oldVote === -1 && str === 'up')) {
                    r.customerVote = 1;
                } else if ((oldVote === 0 && str === 'down') || (oldVote === 1 && str === 'down')) {
                    r.customerVote = -1;
                } else {
                    r.customerVote = 0;
                }
                updateReviews(r, data.message);
            }
        }).catch(err => {
            if (isTokenExpired(err?.response)) {
                setAuth(null); window.open('/login');
            }
        });
    }

export function listReviews(reviews, updateReviews, ctx) {
    const cb = (str, r) => voteReview(str, r, updateReviews, ctx);
    return reviews.map(r => <Col key={r.id} className="text-start py-2 border-top" sm={11}>
            <div className = "d-flex justify-content-start align-items-center my-2">
                <StarRatings 
                    starDimension="1.2em"
                    starSpacing="5px" rating={r.rating}
                    starRatedColor="yellow" />
                <div className="ms-2 d-flex justify-content-start align-items-center flex-wrap">
                    <i onClick={()=>cb('up', r)} 
                        className={`bi bi-hand-${(r.customerVote===1) ? 'thumbs-up-fill':'thumbs-up'} fs-6 cs text-primary`}></i> &nbsp; &nbsp;
                    <span>{r.votes} votes</span> &nbsp; &nbsp;
                    <i onClick={()=>cb('down', r)} 
                        className={`bi bi-hand-${(r.customerVote===-1) ? 'thumbs-down-fill':'thumbs-down'} fs-6 cs text-primary`}></i>
                </div>
            </div>
            <div className="ms-3 mt-2">
                <h5 className="mb-1 fw-bold">{r.headline}</h5>
                <p className="mb-1">{r.comment}</p>
            </div>
            <div className="ms-4">
                {r.customer.fullName} &nbsp; {r.formattedTime}
            </div>
        </Col>
        )
    }
    
export const voteQuestion = (str, r, updateQuestion, ctx) => {
        const { auth, setAuth } = ctx;
        if (auth === null || auth === undefined) {
            updateQuestion(r, "You need to login to vote questions");
            return;
        }
        const url = process.env.REACT_APP_SERVER_URL + "question_vote/vote/" + r.id + "/" + str;
        axios.post(url, null, {
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`
            }
        })
        .then(res => {
            const data = res.data;
            if (data.successful) {
                r.votes = data.voteCount;
                const oldVote = r.customerVote;
                if ((oldVote === 0 && str === 'up') || (oldVote === -1 && str === 'up')) {
                    r.customerVote = 1;
                } else if ((oldVote === 0 && str === 'down') || (oldVote === 1 && str === 'down')) {
                    r.customerVote = -1;
                } else {
                    r.customerVote = 0;
                }
                updateQuestion(r, data.message);
            }
        }).catch(err => {
            if (isTokenExpired(err?.response)) {
                setAuth(null); window.open('/login');
            }
        });
    }

export const listQuestions = (questions, updateQuestions, ctx) => {
    const cb = (str, q) => voteQuestion(str, q, updateQuestions, ctx);
    return questions.map(q => <Col key={q.id} className="text-start py-2 border-top" sm={11}>
            <div className="ms-2 d-flex justify-content-start align-items-center flex-wrap">
                <strong>Question: </strong> &nbsp; &nbsp;
                <i onClick={()=>cb('up', q)} 
                    className={`bi bi-hand-${(q.customerVote===1) ? 'thumbs-up-fill':'thumbs-up'} fs-6 cs text-primary`}></i> &nbsp; &nbsp;
                <span>{q.votes} votes</span> &nbsp; &nbsp;
                <i onClick={()=>cb('down', q)} 
                    className={`bi bi-hand-${(q.customerVote===-1) ? 'thumbs-down-fill':'thumbs-down'} fs-6 cs text-primary`}></i>
            </div>
            <div className="my-2 ms-2">{q.questionContent}</div>
            <div className="my-2 ms-4">{`${q.asker.fullName}, ${q.formattedAskTime}`}</div>

            {(q.isAnswered) && <div className="ms-2">
                <div className="my-2"><strong>Answer: </strong></div>
                <div className="my-2 ms-2">{q.answerContent}</div>
                <div className="my-2 ms-4">{`${q.answerer.fullName}, ${q.formattedAnswerTime}`}</div>
            </div>
            }
        </Col>
        )
}

export const isTokenExpired = (response) => {
    if (response === undefined) return false;
    if (response?.data) {
        const message = response.data.message.toLowerCase()
        if (Number(response.status) === 400
            && message.indexOf("token") > -1
            && message.indexOf("expired") > -1) return true
    }
    return false
}

export const isAddressNotSupported = (response) => {
    if (response?.data) {
        const message = response.data.message.toLowerCase()
        if (Number(response.status) === 404
            && message.startsWith("no shipping available for your location") > -1) return true
    }
    return false
}

export function formatDate(date, dateStyle, timeStyle) {
    if (date) {
        const formatter = new Intl.DateTimeFormat("en-GB", {dateStyle, timeStyle});
         return formatter.format(new Date(date))
    }
    return "";
}

export function isDelivered(orderTracks) {
    return orderTracks.some(t => t.status === "DELIVERED");
}

export function listFormData(data){
     if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
        for (const pair of data.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
    }
}

export const SPINNERS_BORDER = <Spinner animation="border" size="sm" className="d-block m-auto" style={{width: "4rem", height: "4rem"}} />
export const SPINNERS_GROW = <Spinner animation="grow" size="sm" />
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_GROW_HTML = `<div class="spinner-grow spinner-grow-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SEARCH_ICON = `<i class="bi bi-search"></i>`;
