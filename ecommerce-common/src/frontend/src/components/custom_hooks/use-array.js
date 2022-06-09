import {  useState } from "react";

const useArray = () => {
    const [array, setArray] = useState([]);

    //filter array by index
    const filterArray = (index) => {
        const newArray = array.filter((item, i) => i !== index);
        setArray(newArray);
    };

    const showOnlyUpdated = (item) => setArray(item);

    const addToArray = (item) => setArray(state => ([...state, item]));

    

    return {array, setArray, filterArray, addToArray, showOnlyUpdated};
}
 
export default useArray;