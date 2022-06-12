import { useEffect, useState } from "react";
const useAuth = () => {

  const [auth, setA] = useState({});

  useEffect(() => {
    setA(getAuth())
  },[setA])
    
  const getAuth = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
    
  const setAuth = (auth) => {
    setA({...auth});
    localStorage.setItem("user", JSON.stringify(auth));
  };

    return [auth, setAuth];
}
 
export default useAuth;