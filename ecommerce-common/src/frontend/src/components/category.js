import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { listProducts } from "./utilities";

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
                    console.log("not found")
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
            const fileURI = process.env.REACT_APP_SERVER_URL + "category-photos/";
            return  (
            <Row className="justify-content-start p-4">
                {
                    cat.children.map((p) => (
                        <Col key={p.name} sm={6} md={4} lg={2} xlg={2} as={Link} to={"/c/"+p.alias} className="product-in-listing">
                            <img loading="lazy" src={`${fileURI}${p.id}/${p.photo}`} alt={p.name} className="cat-dp" />
                            <h5 className="my-2 text-primary">{p.name}</h5>
                        </Col>
                        ))
                }
            </Row>
                    )
        }
    }


    return ( 
        <>
            {listParents()}
            {listChildren()}
            <div className="my-4">
                {listProducts(products, cat?.name, "category")}
            </div>
        </>
     );
}
 
export default Category;