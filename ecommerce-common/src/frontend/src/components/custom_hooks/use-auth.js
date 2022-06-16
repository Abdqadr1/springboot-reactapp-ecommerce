import { useEffect, useState } from "react";
const useAuth = () => {
    
  const getAuth = () => {
    return JSON.parse(localStorage.getItem("user")) ?? {};
  };
  
  const [auth, setA] = useState(getAuth());

  useEffect(() => {
    setA(getAuth())
  },[setA])

    
  const setAuth = (auth) => {
    setA({...auth});
    localStorage.setItem("user", JSON.stringify(auth));
  };


    return [auth, setAuth];
}
 
export default useAuth;