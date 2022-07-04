import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Routes, Route, HashRouter} from "react-router-dom";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import ListCategories from "./components/list-categories";
import useSettings from "./components/use-settings";
import Category from "./components/category";
import Product from "./components/product";
import ProductSearch from "./components/product-search";
import RegisterSuccess from "./components/register-success";
import "./css/home.css";
import Logout from "./components/logout";
import OAuth2Redirect from "./components/oauth_redirect";
import ForgotPassword from "./components/forgot-password";
import ResetPassword from "./components/reset-password";
import ShoppingCart from "./components/shopping-cart";
import { AuthContext, getAuthFromLocalStorage, setAuthToLocalStorage } from "./components/custom_hooks/use-auth";
import { useState } from "react";
import Addresses from "./components/addresses";
import Checkout from "./components/checkout";
import Orders from "./components/orders/orders";
import Reviews from "./components/review_s.js/reviews";
function App() {
  
  // if ("serviceWorker" in window.navigator) {
  //   navigator.serviceWorker.register("worker.js");
  // }

  const { COPYRIGHT } = useSettings();
  const saved = getAuthFromLocalStorage();
  const [auth, setA] = useState(saved ?? null)
  const setAuth = (a) => {
    setA(a);
    setAuthToLocalStorage(a);
  }

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
        <div className="App">
            <HashRouter>
            <NavBar />
            <div className="content">
            <Routes>
                <Route path="/" element={<ListCategories />} />
                <Route path="/shop" element={<ListCategories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-success" element={<RegisterSuccess />} />
                <Route path="/c" element={<ListCategories />} />
                <Route path="/c/:alias" element={<Category />} />
                <Route path="/p" element={<Category />} />
                <Route path="/p/:alias" element={<Product />} />
                <Route path="/p/search/:keyword" element={<ProductSearch />} />
                <Route path="/o2" element={<OAuth2Redirect />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset_password" element={<ResetPassword />} />
                <Route path="/shopping_cart" element={<ShoppingCart />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="*" element={<div className="my-4">Not found</div>} />
            </Routes>
            </div>
          </HashRouter>
        
          <footer className="bg-dark py-3 text-light fw-bold">{COPYRIGHT ?? ""}</footer>
      </div>
    </AuthContext.Provider>
    
  );
}

export default App;
