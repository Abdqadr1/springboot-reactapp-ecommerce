import { useEffect, useState } from "react";

const useArray = () => {
    const [array, setArray] = useState([]);

    //filter array by index
    const filterArray = (index) => {
        const newArray = array.filter((item, i) => i !== index);
        setArray(newArray);
    };

    const filterWithId = (item) => {
        const newArray = array.filter(arr => arr.id !== item.id);
        setArray(newArray);
    }

    const showOnlyUpdated = (item) => setArray(item);

    const addToArray = (item) => setArray(state => ([...state, item]));

    const updateArray = (item) => {
        const index = array.findIndex(arr => arr.id === item.id);
        array[index] = item;
        setArray([...array]);
    }

    const updateItemProp = (id, prop, val) => {
        const index = array.findIndex(c => c.id === id);
        const item = array[index];
        item[prop] = val;
        setArray([...array])
    }

    useEffect(() => {
        // console.log("updating")
    }, [array])
    

    return {array, setArray, filterArray, addToArray, showOnlyUpdated, updateArray, filterWithId, updateItemProp};
}
 
export default useArray;