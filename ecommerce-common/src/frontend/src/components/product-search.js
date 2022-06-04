import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listProducts } from "./utilities";

const ProductSearch = () => {
    const {keyword} = useParams();
    const [results, setResults] = useState([]);
    const [pageInfo, setPageInfo] = useState({currentPage: 1})

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
          {listProducts(results, keyword, "search")}  
        </>
     );
}
 
export default ProductSearch;