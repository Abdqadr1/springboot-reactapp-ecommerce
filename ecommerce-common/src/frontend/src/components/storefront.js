import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import useSettings from "./use-settings";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "./search";
import { listProducts, formatPrice,SPINNERS_BORDER, listCategories } from "./utilities";
import CustomToast from "./custom_toast";
import { Row, Col } from "react-bootstrap";
const Storefront = () => {
    const [storefront, setStorefront ] = useState([]);
    const [categories, setCategories ] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [isLoading, setLoading] = useState(true);
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
        setLoading(true);
        axios.get(url, {
            signal: abortController.current.signal
        })
        .then(res => {
            loadCategories(cUrl, abortController.current, res.data);
        })
        .catch(() => setToast(s => ({ ...s, show: true, message: "An error occurred" })))
        .finally(()=> setLoading(false))
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
                return listCategories(categories);
            case "CATEGORY":
                map = models.map(m => display(m.category.imagePath, m.category.name, m.category.alias, 'c'));
                map = <Row className="justify-content-start p-4 mx-0">{map}</Row>
                break;
            case "BRAND":
                map = models.map(m => display(m.brand.imagePath, m.brand.name, m.brand.id, 'b'));
                map = <Row className="justify-content-start p-4 mx-0">{map}</Row>
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
        return <Col key={alias + name} xs={6} sm={4} md={3} lg={2} xlg={2} className="product-in-listing my-2"
                    as={Link} to={`/${which}/${encodeURIComponent(alias)}?name=${name}`}>
                <img src={image} alt={name} className="cat-dp" />
                <h6 className="mt-2">{name}</h6>
        </Col>
    }

    return (
         <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :
                        <>
                            <Search />
                            <div>
                                {listStorefront()}
                            </div> 
                        </>
            }
            <CustomToast {...toast} setToast={setToast} position="middle-center" />
        </>
        
        
     );
}
 
export default Storefront;