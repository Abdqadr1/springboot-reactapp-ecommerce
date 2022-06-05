import { Route, Routes } from "react-router-dom";
import AccountHome from "./AccountHome";
import Brands from "./brand/brands";
import Categories from "./category/categories";
import MyNavbar from "./navbar";
import Users from "./user/users";
import Products from "./product/products";
import SettingsPage from "./settings";

const Account = () => {

    return ( 
        <div>
            <MyNavbar />
            <Routes>
                <Route path="/" element={<AccountHome />} />
                <Route path="/users" element={<Users />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/products" element={<Products />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/customers" element={<div>customers</div>} />
                <Route path='*' element={<h2 className='text-center text-danger'>Page not found</h2>}></Route>
            </Routes>
        </div>
     );
}
 
export default Account;