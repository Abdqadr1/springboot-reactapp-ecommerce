import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { formatPrice, listProducts } from "./utilities";
import useSettings from "./use-settings";
import Search from "./search";

const Category = () => {

    const [cat, setCat] = useState(null);
    const [products, setProducts] = useState([])
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        endCount: 1,
        numberPerPage: 1,
        startCount: 1,
        totalPages: 1,
        totalElements: 1
    })

    const { alias } = useParams();
    
    const {SITE_NAME} = useSettings();
    useEffect(()=>{document.title = `${alias} - ${SITE_NAME}`},[SITE_NAME, alias])
    
    const {CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE} = useSettings();

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    useEffect(() => {
        const abortController = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "c/" + alias;
        axios.get(url, {
            signal: abortController.signal
        })
            .then(res => {
                setCat(res.data)
            }).catch(err => {
                console.log(err)
                console.log("not found")
            })
            // return () => abortController.abort();
    }, [alias])

      useEffect(() => {
        const abortController = new AbortController();
        if(cat != null){
            const url = `${process.env.REACT_APP_SERVER_URL}p/cat?page-number=1&cat=${cat.id}`;
            axios.get(url, {
                signal: abortController.signal
            })
                .then(res => {
                    const data = res.data
                    setProducts(data.products)
                    setPageInfo({
                    currentPage: data.currentPage,
                    endCount: data.endCount,
                    numberPerPage: data.numberPerPage,
                    startCount: data.startCount,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    });
                }).catch(err => {
                    setProducts([])
                })
            }
            return () => abortController.abort();
    }, [cat])

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
            return  (
            <Row className="justify-content-start p-4 mx-0">
                {
                    cat.children.map((p) => (
                        <Col key={p.name} sm={3} md={2} lg={2} xlg={2} as={Link} to={"/c/"+p.alias} className="product-in-listing my-2">
                            <img loading="lazy" src={p.imagePath} alt={p.name} className="cat-dp" />
                            <h5 className="mt-2 text-primary">{p.name}</h5>
                        </Col>
                        ))
                }
            </Row>
                    )
        }
    }


    return ( 
        <>
            <Search />
            {listParents()}
            {listChildren()}
            <div className="my-4">
                {listProducts(products, cat?.name, "category", priceFormatter())}
            </div>
        </>
     );
}
 
export default Category;