import { Route, Routes } from "react-router-dom";
import AccountHome from "./AccountHome";
import MyNavbar from "./navbar";
import Users from "./users";

const Account = () => {

    return ( 
        <div>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<AccountHome />} />
                <Route path="/users" element={<Users />} />
                <Route path="/customers" element={<div>customers</div>} />
                <Route path='*' element={<h2 className='text-center text-danger'>Page not found</h2>}></Route>
            </Routes>
        </div>
     );
}
 
export default Account;