import axios from "axios";
import { useEffect, useState } from "react";

const useSettings = () => {
    const url = process.env.REACT_APP_SERVER_URL + "set/get";
    function getFromStorage() {
            return JSON.parse(sessionStorage.getItem("settings")) ;
    }

    function fetchSettings() {
        axios.get(url)
        .then(response => {
            const data = response.data;
            data.settings.forEach(el => {
                settings[el.key] = el.value;
            });
            setSettings({...settings})
            sessionStorage.setItem("settings", JSON.stringify(settings))
        })
        .catch(() => {
            console.log("Could not fetch settings");
         })
    }

    const [settings, setSettings] = useState(getFromStorage() ?? {});

    useEffect(() => {
        const savedSettings = getFromStorage();
        if (savedSettings) {
            setSettings(savedSettings);
        } else {
            fetchSettings()
        } 
        
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])

  
     

    return settings
}
 
export default useSettings;