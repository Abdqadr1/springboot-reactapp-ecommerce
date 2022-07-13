import { Route, Routes } from "react-router-dom";
import AccountHome from "./AccountHome";
import Brands from "./brand/brands";
import Categories from "./category/categories";
import MyNavbar from "./navbar";
import Users from "./user/users";
import Products from "./product/products";
import SettingsPage from "./settings";
import Customers from "./customers/customers";
import ShippingRates from "./shipping_rate/shipping-rates";
import Orders from "./orders/orders";
import SalesReport from "./sales_report";
import Reviews from "./review_s/reviews";
import Questions from "./questions/questions";
import Articles from "./articles/articles";

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
                <Route path="/settings/:which" element={<SettingsPage />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/shipping_rate" element={<ShippingRates />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/sales_report" element={<SalesReport />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/articles" element={<Articles />} />
                <Route path='*' element={<h2 className='text-center text-danger'>Page not found</h2>}></Route>
            </Routes>
        </div>
     );
}
 
export default Account;