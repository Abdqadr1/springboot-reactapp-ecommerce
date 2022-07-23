import { useEffect, useState, useRef } from "react";
import useSettings from "./use-settings";
import { Row } from "react-bootstrap";
import axios from "axios";
import useArray from "./custom_hooks/use-array";
import Search from "./search";
import { listCategories,SPINNERS_BORDER } from "./utilities";
const ListCategories = () => {
    const [isLoading, setLoading] = useState(true);
    const [abortController, loadRef] = [useRef(new AbortController()), useRef()];

    const { array: categories, setArray: setCategories } = useArray([]);
    
    const {SITE_NAME} = useSettings();
    useEffect(() => {
        document.title = "Categories - " + SITE_NAME; 
        loadRef?.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        abortController.current = new AbortController();
        const url = process.env.REACT_APP_SERVER_URL + "c";
        setLoading(true);
        axios.get(url, {signal: abortController.current.signal})
        .then(res => {
            setCategories(res.data)
        }).finally(()=>setLoading(false))
        return () => abortController.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
         <>
            <div className="loadRef" tabIndex="22" ref={loadRef}></div>
            {
                (isLoading)
                    ? <div className="mx-auto" style={{ height: "30vh", display: "grid" }}>{SPINNERS_BORDER}</div>
                    :
                        <>
                            <Search />
                            <Row className="mt-5 px-2 mx-0 justify-content-start">
                                {listCategories(categories)}
                            </Row> 
                        </>
            }
        </>
        
     );
}
 
export default ListCategories;