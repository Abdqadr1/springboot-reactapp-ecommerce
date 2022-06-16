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

      const filterWithId = (item) => {
        const newArray = array.filter(arr => arr.id !== item.id);
        setArray(newArray);
    }

    

    return {array, setArray, filterArray, filterWithId, addToArray, showOnlyUpdated};
}
 
export default useArray;