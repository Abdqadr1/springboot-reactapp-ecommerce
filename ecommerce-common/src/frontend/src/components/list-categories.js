import { useEffect } from "react";
import useSettings from "./use-settings";
import { Row } from "react-bootstrap";
import axios from "axios";
import useArray from "./custom_hooks/use-array";
import Search from "./search";
import { listCategories } from "./utilities";
const ListCategories = () => {

    const { array: categories, setArray: setCategories } = useArray([]);
    
    const {SITE_NAME} = useSettings();
    useEffect(()=>{document.title = "Categories - " + SITE_NAME},[SITE_NAME])

    useEffect(() => {
        const url = process.env.REACT_APP_SERVER_URL + "c";
        axios.get(url, {})
        .then(res => {
            setCategories(res.data)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Search />
            <Row className="mt-5 px-2 mx-0 justify-content-start">
                {listCategories(categories)}
            </Row> 
        </>
        
     );
}
 
export default ListCategories;