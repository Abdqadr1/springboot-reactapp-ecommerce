import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Row, Col, Button, InputGroup, FormControl, Breadcrumb} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import MyCarousel from "./image-carousel";
import { getDiscountPrice, getShortName, formatPrice } from "./utilities";
import useSettings from "./use-settings";

const Product = () => {
    const {alias} = useParams();
    const [product, setProduct] = useState(null);

    
    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE,SITE_NAME } = useSettings();

    useEffect(()=>{document.title = `${alias} - ${SITE_NAME}`},[SITE_NAME, alias])

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    const [showCarousel, setShowCarousel] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const bigImageRef = useRef();
    const fileUrl = process.env.REACT_APP_SERVER_URL + "product-images/";

    useEffect(() => {
        const abortController = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "p/alias/" + alias;
        axios.get(url, {
            signal: abortController.signal
        })
            .then(res => {
                setProduct(res.data)
            }).catch(err => {
                console.log(err)
                console.log("not found")
            })
    }, [alias])

    function isInStock(){
        if(product.inStock){
            return (
              <>
                <p className="fw-bold text-success">In Stock</p>
                <InputGroup className="mb-3 mx-auto" style={{"max-width": "110px"}} >
                  <InputGroup.Text>-</InputGroup.Text>
                  <FormControl aria-label="Number" disabled defaultValue={1} className="text-center"/>
                  <InputGroup.Text>+</InputGroup.Text>
                </InputGroup>
                <Button variant="primary">Add to Cart</Button>
              </>
            );
        } else {
            <p className="fw-bold text-danger">Out of stock</p>
        }
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
        const images = [product.mainImage, ...product.extraImages.map(m => m.path)]
        const url = (i===0) ? `${fileUrl}${product.id}/main-image` : `${fileUrl}${product.id}/extra-images`;
        img.src = `${url}/${images[i]}`;
        setImageIndex(i)
    }

    function listImages(images){
        return (
            <div className="d-flex justify-content-center my-2">
                {images.map((img,i) => {
                    const url = (i===0) ? `${fileUrl}${product.id}/main-image` : `${fileUrl}${product.id}/extra-images`;
                    return (<div key={i} className="mx-2 border border-secondary rounded p-1" onClick={()=>showImage(i)}>
                        <img src={`${url}/${img}`} alt="product" className="small-img" />
                    </div>)
                    }
                )}
            </div>
        )
    }

    function listProduct(){
        if(product){
            const images = [product.mainImage, ...product.extraImages.map(m => m.path)]
            return (
                <>
                    <Row className="justify-content-center p-4 mx-0">
                        <Col sm={9} md={5}>
                            <img ref={bigImageRef} src={`${fileUrl}${product.id}/main-image/${product.mainImage}`} 
                            alt="product" className="main-image" onClick={showBigImage} data-index={imageIndex} />
                            {listImages(images)}
                        </Col>
                        <Col sm={9} md={5}>
                            <h2 className="text-start fw-bold">{product.name}</h2>
                            <p className="text-start fs-6 mb-1">Brand {product.brand.name}</p>
                            {(product.discountPrice > 0)
                                ? <>
                                    <p className="text-start fs-6 mb-1">List price <del>{priceFormatter()(product.price)}</del></p>
                                    <p className="text-start fs-5 mb-1">
                                        Price 
                                        <span className="text-danger mx-1 fw-bold">{priceFormatter()(product.price,getDiscountPrice(product.discountPrice, product.price))}</span>
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
                            {isInStock()}
                        </Col>
                    </Row>  
                    <hr/>
                    <div className="px-3 p1-2">
                        <h5 className="text-start mb-4 fw-bold">Product Description</h5>
                            <p className="text-start fs-6 mb-1" dangerouslySetInnerHTML={{__html: product.fullDescription}}></p>
                    </div>
                    <hr/>
                    <div className="px-3 py-1">
                        <h5 className="text-start mb-3 fw-bold">Product Details</h5>
                        {listDetails()}
                    </div>
                    <MyCarousel imageIndex={imageIndex} showCarousel={showCarousel} setShowCarousel={setShowCarousel} items={images} id={product.id}/>
                </>
                
            )
        }
        return "";
    }

    return ( 
        <>
            {breadCrumbs()}
            {listProduct()}
        </>
        
     );
}
 
export default Product;