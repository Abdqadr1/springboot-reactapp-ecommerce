const useAuth = () => {

  let auth = {
    accessToken: "",
    refreshToken: ""
  }
    
  const getAuth = () => {
    const _auth = JSON.parse(localStorage.getItem("user"));
    if(_auth) {
      auth = _auth;
    }
    return auth
  };
  
  const setAuth = (auth) => {
    localStorage.setItem("user", JSON.stringify(auth));
  };

  return [getAuth(), setAuth];
}
 
export default useAuth;