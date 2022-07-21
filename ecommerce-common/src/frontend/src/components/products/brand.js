import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { formatPrice, listProducts, SPINNERS_BORDER } from "../utilities";
import useSettings from "../use-settings";
import Search from "../search";
import CustomToast from "../custom_toast";

const Brand = () => {
    const abortController = useRef(new AbortController());
    const [toast, setToast] = useState({ show: false, message: "" });
    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        number: 1, totalPages: 1, startCount: 1,
        endCount: null, totalElements: null,numberPerPage: 1
    })

    const { id } = useParams();
    const [searchParams,] = useSearchParams();
    const name = searchParams.get("name")
    
    const {SITE_NAME} = useSettings();
    useEffect(()=>{document.title = `${name} - ${SITE_NAME}`},[SITE_NAME, name])
    
    const {CURRENCY_SYMBOL, CURRENCY_SYMBOL_POSITION, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE} = useSettings();

    function priceFormatter() {
        return (price) =>
            formatPrice(price, CURRENCY_SYMBOL, DECIMAL_DIGIT, THOUSANDS_POINT_TYPE, CURRENCY_SYMBOL_POSITION)
    }
    const loadProducts = useCallback((abortController) => {
        const url = `${process.env.REACT_APP_SERVER_URL}p/brand?page-number=1&brand=${id}`;
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
    }, [id])

    useEffect(() => {
        abortController.current = new AbortController();
        loadProducts(abortController.current, pageInfo.number);
        return () => abortController.current.abort();
    }, [name, loadProducts, pageInfo.number])



    return ( 
        <>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    : <>
                        <Search />
                        <div className="my-4">
                            {listProducts(products, name, "brand", priceFormatter())}
                        </div>
                    </>
            }
            <CustomToast {...toast} setToast={setToast} position="middle-center" />
        </>
        
     );
}
 
export default Brand;