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

       const updateArray = (item) => {
        const index = array.findIndex(arr => arr.id === item.id);
        array[index] = item;
        setArray([...array]);
    }

    

    return {array, setArray, filterArray, filterWithId, addToArray, showOnlyUpdated, updateArray};
}
 
export default useArray;