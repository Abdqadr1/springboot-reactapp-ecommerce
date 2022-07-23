import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { formatPrice, listProducts, SPINNERS_BORDER } from "../utilities";
import useSettings from "../use-settings";
import Search from "../search";
import CustomToast from "../custom_toast";
import MyPagination from "../orders/paging";

const Category = () => {
    const [abortController, loadRef] = [useRef(new AbortController()), useRef()];
    const [cat, setCat] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })

    const { alias } = useParams();
    const {SITE_NAME} = useSettings();
    useEffect(() => {
        document.title = `${alias} - ${SITE_NAME}`;
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SITE_NAME, alias])
    
    const {CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE} = useSettings();

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    const loadProducts = useCallback((abortController, number) => {
        const url = `${process.env.REACT_APP_SERVER_URL}p/cat?page-number=${number}&cat=${cat.id}`;
        setLoading(true);
        axios.get(url, {
            signal: abortController.signal
        })
            .then(res => {
                const data = res.data
                setProducts(data.products)
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
            }).catch(err =>  setToast(s => ({ ...s, show: true, message: "An error occurred" })))
            .finally(()=>{
                setLoading(false);
            })
    }, [cat?.id])

    useEffect(() => {
        const url = process.env.REACT_APP_SERVER_URL + "c/" + alias;
        abortController.current = new AbortController();
        setLoading(true);
        axios.get(url, {
            signal: abortController.current.signal
        })
        .then(res => {
            setCat(res.data);
        }).catch(err => setToast(s => ({ ...s, show: true, message: "An error occurred" })))
        return () => abortController.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alias, loadProducts])

    useEffect(() => {
        if(cat){
            loadProducts(abortController.current, pageInfo.number)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadProducts, pageInfo?.number, cat])

    

    function listParents() {
        if(cat !== null && cat){
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
    function listChildren(){
        if(cat && cat.children.length > 0){
            return (
                <>
                    <h4 className="text-center fw-bold my-2">Sub categories</h4>
                    <Row className="justify-content-start p-4 mx-0">
                        {
                            cat.children.map((p) => (
                                <Col key={p.name} xs={6} sm={4} md={3} lg={2} xlg={2} as={Link} to={"/c/"+p.alias} className="product-in-listing my-2">
                                    <img loading="lazy" src={p.imagePath} alt={p.name} className="cat-dp" />
                                    <h6 className="mt-2 text-primary text-center">{p.name}</h6>
                                </Col>
                                ))
                        }
                    </Row>  
                </>
                
            )
        }
    }


    return ( 
        <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
                        <Search />
                        {listParents()}
                        {listChildren()}
                        <div className="my-4">
                            {listProducts(products, cat?.name, "category", priceFormatter())}
                            {(products.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""} 
                        </div>
                    </>
            }
            <CustomToast {...toast} setToast={setToast} position="middle-center" />
        </>
        
     );
}
 
export default Category;