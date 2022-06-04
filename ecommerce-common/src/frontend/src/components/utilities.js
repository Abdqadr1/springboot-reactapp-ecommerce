import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export const getShortName = (name, len=60) => {
    if(name.length > len){
        return name.substring(0,len) + "...";
    }
    return name;
}
export const getPrices =(discount, price) => {
    if(discount > 0){
        const discountPrice =  getDiscountPrice(discount, price);
        return (
          <h5 className="text-dark text-start fw-bold">
            <span>${discountPrice}</span>
            <del className="text-danger mx-2">${price}</del>
          </h5>
        );
    }
    return (
      <h5 className="text-dark text-start fw-bold">
        <span>${price}</span>
      </h5>
    );
}
export const getDiscountPrice = (discount, price) =>  Number(price * (100 - discount) / 100).toFixed(2);

export function listProducts(results, keyword, type="category"){
        if(results.length > 0){
            const fileURI = process.env.REACT_APP_SERVER_URL + "product-images/";
            return (
                <>
                    {
                        (type === "category") 
                        ? <h4 className="py-3">Products  in Category {keyword}</h4>
                        : <h3 className="mt-4 mb-2"> Search Results for "{keyword}"</h3>
                    }
                    <Row className="justify-content-start p-4">
                        {
                            results.map((p) => (
                                <Col key={p.name} sm={6} md={4} lg={2} xlg={2} className="product-in-listing" as={Link} to={"/p/"+p.alias}>
                                    <img loading="lazy" src={`${fileURI}${p.id}/main-image/${p.mainImage}`} alt={getShortName(p.name, 10)} className="cat-dp" />
                                    <h5 className="my-2 text-primary text-start">{getShortName(p.name)}</h5>
                                    {getPrices(p.discountPrice, p.price)}
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