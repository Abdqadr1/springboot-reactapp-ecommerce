import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import useSettings from "./use-settings";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Search from "./search";
import { listProducts, formatPrice } from "./utilities";
import CustomToast from "./custom_toast";
const Storefront = () => {
    const [storefront, setStorefront ] = useState([]);
    const [categories, setCategories ] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "" });
    const abortController = useRef(new AbortController());

    const sort = (a, b) => {
        return a.position - b.position;
    }
    
    const {CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME} = useSettings();

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    useEffect(()=>{document.title = "Home - " + SITE_NAME},[SITE_NAME])

     const loadCategories = useCallback((url, abortController, fronts) => {
        axios.get(url, {
            signal: abortController.signal
        })
            .then(response => {
                setStorefront(fronts.sort(sort));
                setCategories(response.data);
            })
            .catch(res => {
                setToast(s => ({ ...s, show: true, message: "An error occurred" }))
            })
      },[],
    )

    useLayoutEffect(() => {
        const url = process.env.REACT_APP_SERVER_URL + "storefront";
        const cUrl = process.env.REACT_APP_SERVER_URL + "c";
        abortController.current = new AbortController();
        axios.get(url, {
            signal: abortController.current.signal
        })
        .then(res => {
            loadCategories(cUrl, abortController.current, res.data);
        })
        .catch(()=>  setToast(s => ({ ...s, show: true, message: "An error occurred" })))
        return () => {
            abortController.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function listStorefront(){
        return storefront.map(front => {
            return (<div key={front.id} className="py-2 px-3">
                <h3 className="mt-3 mb-0 text-start">{front.heading}</h3>
                <h6 className="mt-1 text-start" dangerouslySetInnerHTML={{__html: front.description}}></h6>
                {listModels(front.type, front.models)}
            </div>)
        })
    }
    function listModels(type, models){
        let map = "";
        switch(type){
            case "ALL_CATEGORIES":
                return listCategories();
            case "CATEGORY":
                map = models.map(m => display(m.category.imagePath, m.category.name, m.category.alias, 'c'));
                break;
            case "BRAND":
                map = models.map(m => display(m.brand.imagePath, m.brand.name, m.brand.id, 'b'));
                break;
            case "ARTICLE":
                map = models.map(m => <Link key={m.id} to={"/m/"+m.article.alias} className="mx-2">{m.article.title}</Link>);
                break;
            case "PRODUCT":
                const products = models.map(m =>m.product);
                return listProducts(products, "", "", priceFormatter());
            default: ;
        }
        return <div className="d-flex flex-wrap mt-2 px-0">{map}</div>
    }
    const display = (image, name, alias, which) => {
        return <div key={alias+name} className="px-0 my-1 mx-3">
                <img src={image} alt={name}style={{width: '150px', aspectRatio: 1}} />
                <div style={{maxWidth:'150px'}} className="mt-2">
                    <Link to={`/${which}/${encodeURIComponent(alias)}?name=${name}`}>{name}</Link>
                </div>
        </div>
    }

    function listCategories(){
        const map = categories.map(cat => {
            const photo = cat.photo && cat.photo !== "null"
            ? <img loading="lazy" src={cat.imagePath} alt={cat.name} className="cat-dp" />
            :<span className="avatar">
                <i className="bi bi-image-fill"></i>
            </span>
            return (
                <Col className="my-3 category-listing" key={cat.name + cat.id} xs={4} md={2} lg={2}
                    as={Link} to={"/c/" + encodeURIComponent(cat.alias)}>
                        {photo}
                        <h5 className="my-2">{cat.name}</h5>
                </Col>
            )
        })
        return <Row className="mt-5 px-2 mx-0 justify-content-start">{map}</Row>;
    }

    return (
        
         <>
            <Search />
            <div>
                {listStorefront()}
            </div> 
            <CustomToast {...toast} setToast={setToast} position="middle-center" />
        </>
        
        
     );
}
 
export default Storefront;