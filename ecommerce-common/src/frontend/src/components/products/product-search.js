import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listProducts, formatPrice } from "../utilities";
import useSettings from "../use-settings";
import Search from "../search";

const ProductSearch = () => {
    const {keyword} = useParams();
    const [results, setResults] = useState([]);
    const [pageInfo, setPageInfo] = useState({ currentPage: 1 })

    
    const { CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, SITE_NAME } = useSettings();
    
    useEffect(()=>{document.title = `${keyword} - ${SITE_NAME}`},[SITE_NAME, keyword])

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }

    useEffect(() => {
        const abortController = new AbortController();
        const url = `${process.env.REACT_APP_SERVER_URL}p/search/${keyword}?page-number=${pageInfo.currentPage}`;
        axios.get(url, {
            signal: abortController.signal
        })
            .then(res => {
                const data = res.data;
                setResults(data.products)
                setPageInfo((state) => ({
                    ...state,
                  currentPage: data.currentPage,
                  endCount: data.endCount,
                  numberPerPage: data.numberPerPage,
                  startCount: data.startCount,
                  totalPages: data.totalPages,
                  totalElements: data.totalElements,
                }));
            }).catch(err => {
                console.log(err)
                console.log("not found")
            })
    }, [keyword, pageInfo.currentPage])

   

    return ( 
        <>
            <Search />
          {listProducts(results, keyword, "search", priceFormatter())}  
        </>
     );
}
 
export default ProductSearch;