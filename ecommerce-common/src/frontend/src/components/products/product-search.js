import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { listProducts, formatPrice, SPINNERS_BORDER } from "../utilities";
import useSettings from "../use-settings";
import Search from "../search";
import MyPagination from "../orders/paging";

const ProductSearch = () => {
    const {keyword} = useParams();
    const [results, setResults] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({ number: 1 });

    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `${keyword} - ${SITE_NAME}`},[SITE_NAME, keyword])

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    const fetchProducts = useCallback((abortController, keyword, number) => {
         setLoading(true);
        const url = `${process.env.REACT_APP_SERVER_URL}p/search/${keyword}?page-number=${number}`;
        axios.get(url, {
            signal: abortController.signal
        })
            .then(res => {
                const data = res.data;
                setResults(data.products)
                setPageInfo((state) => ({
                    ...state,
                  number: data.currentPage,
                  endCount: data.endCount,
                  numberPerPage: data.numberPerPage,
                  startCount: data.startCount,
                  totalPages: data.totalPages,
                  totalElements: data.totalElements,
                }));
            }).catch(err => {
            }).finally(()=>setLoading(false))
    },[])

    useEffect(() => {
        const abortController = new AbortController();
        fetchProducts(abortController, keyword, pageInfo.number);
        return () => abortController.abort();
    }, [fetchProducts, keyword, pageInfo.number])

   

    return ( 
        <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :  
                    <>
                        <Search />
                        {listProducts(results, keyword, "search", priceFormatter())}
                        {(results.length > 0) ? <MyPagination pageInfo={pageInfo} setPageInfo={setPageInfo} /> : ""}  
                    </>
            }
        </>
     );
}
 
export default ProductSearch;