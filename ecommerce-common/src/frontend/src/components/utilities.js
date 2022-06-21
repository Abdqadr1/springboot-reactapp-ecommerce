import { Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export const getShortName = (name, len=60) => {
    if(name.length > len){
        return name.substring(0,len) + "...";
    }
    return name;
}
export const getPrices = (discount, price, realPrice, formatPrice) => {
    if(discount > 0){
        return (
          <h5 className="text-dark text-start fw-bold fs-6">
            <span>{formatPrice(realPrice)}</span>
            <del className="text-danger mx-2">{formatPrice(price)}</del>
          </h5>
        );
    }
    return (
      <h5 className="text-dark text-start fw-bold">
        <span>{formatPrice(price)}</span>
      </h5>
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

export function listProducts(results, keyword, type="category", formatPrice){
        if(results.length > 0){
            const fileURI = process.env.REACT_APP_SERVER_URL + "product-images/";
            return (
                <>
                    {
                        (type === "category") 
                        ? <h4 className="py-3">Products  in Category {keyword}</h4>
                        : <h3 className="mt-4 mb-2"> Search Results for "{keyword}"</h3>
                    }
                    <Row className="justify-content-start p-4 mx-0">
                        {
                            results.map((p) => (
                                <Col key={p.name} xs={6} sm={4} md={3} lg={2} xlg={2} className="product-in-listing" as={Link} to={"/p/"+p.alias}>
                                    <img loading="lazy" src={`${fileURI}${p.id}/${p.mainImage}`} alt={getShortName(p.name, 10)} className="cat-dp" />
                                    <h5 className="my-2 text-primary text-start">{getShortName(p.name)}</h5>
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


export const isTokenExpired = (response) => {
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

export function listFormData(data){
      for (const pair of data.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
}

export const SPINNERS_BORDER = <Spinner animation="border" size="sm" />
export const SPINNERS_GROW = <Spinner animation="grow" size="sm" />
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_GROW_HTML = `<div class="spinner-grow spinner-grow-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SEARCH_ICON = `<i class="bi bi-search"></i>`;
