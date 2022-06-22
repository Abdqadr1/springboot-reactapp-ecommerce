import { Spinner } from "react-bootstrap";

const LoaderScreen = ({show}) => {
    return ( 
        <>
            { show && 
                <div className="overlay bg-light">
                    <Spinner animation="border" style={{ width: "10rem", height: "10rem", borderWidth: ".5rem"}} role="status"/>
                </div>
            }
        </>
        
     );
}
 
export default LoaderScreen;