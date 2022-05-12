import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./context";
import MyNavbar from "./navbar";
import Users from "./users";

const Account = () => {
    const { auth } = useContext(AuthContext);
    return ( 
        <div>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<Users />} />
            </Routes>
        </div>
     );
}
 
export default Account;