import { Route, Routes } from "react-router-dom";
import AccountHome from "./AccountHome";
import Categories from "./category/categories";
import MyNavbar from "./navbar";
import Users from "./user/users";

const Account = () => {

    return ( 
        <div>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<AccountHome />} />
                <Route path="/users" element={<Users />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/customers" element={<div>customers</div>} />
                <Route path='*' element={<h2 className='text-center text-danger'>Page not found</h2>}></Route>
            </Routes>
        </div>
     );
}
 
export default Account;