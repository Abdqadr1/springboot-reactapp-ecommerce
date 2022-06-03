import { useParams } from "react-router-dom";

const Product = () => {
    const {alias} = useParams();


    return ( 
        <div>product {alias}</div>
     );
}
 
export default Product;