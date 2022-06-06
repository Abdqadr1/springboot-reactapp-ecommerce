import axios from "axios";
import { useEffect, useState } from "react";

const useSettings = () => {
    const url = process.env.REACT_APP_SERVER_URL + "set/get";
    const [settings, setSettings] = useState({});


     useEffect(() => {
         const savedSettings = getFromStorage();
         if (savedSettings) {
             setSettings(savedSettings);
         } else {
             fetchSettings();
         }
         
     }, [])

    function getFromStorage() {
        return JSON.parse(localStorage.getItem("settings"));
    }
    function fetchSettings() {
        axios.get(url)
        .then(response => {
            const data = response.data;
            data.settings.forEach(el => {
                settings[el.key] = el.value;
            });
            setSettings({...settings})
            localStorage.setItem("settings", JSON.stringify(settings))
        })
        .catch(error => {
            const response = error.response;
            console.log(response)
         })
    }
     
    
    return settings
}
 
export default useSettings;