const useAuth = () => {
    
    const getAuth = () => {
      return JSON.parse(localStorage.getItem("user"));
    };
    
    const setAuth = (auth) => {
      localStorage.setItem("user", JSON.stringify(auth));
    };

    return [getAuth(), setAuth];
}
 
export default useAuth;