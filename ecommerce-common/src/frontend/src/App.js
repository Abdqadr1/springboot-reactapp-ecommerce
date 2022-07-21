import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Routes, Route, HashRouter} from "react-router-dom";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register/register";
import ListCategories from "./components/list-categories";
import Category from "./components/products/category";
import Product from "./components/products/product";
import ProductSearch from "./components/products/product-search";
import RegisterSuccess from "./components/register/register-success";
import "./css/home.css";
import Logout from "./components/logout";
import OAuth2Redirect from "./components/oauth_redirect";
import ForgotPassword from "./components/register/forgot-password";
import ResetPassword from "./components/register/reset-password";
import ShoppingCart from "./components/cart/shopping-cart";
import { AuthContext, getAuthFromLocalStorage, setAuthToLocalStorage } from "./components/custom_hooks/use-auth";
import { useLayoutEffect, useState } from "react";
import Addresses from "./components/addresses/addresses";
import Checkout from "./components/cart/checkout";
import Orders from "./components/orders/orders";
import Reviews from "./components/review_s.js/reviews";
import ProductReviews from "./components/products/product_reviews";
import Questions from "./components/questions/questions";
import ProductQuestions from "./components/products/product_questions";
import Footer from "./components/footer";
import axios from "axios";
import MenuArticle from "./components/menu_article";
import Storefront from "./components/storefront";
import Brand from "./components/products/brand";
import Contact from "./components/contact";
function App() {
  
  // if ("serviceWorker" in window.navigator) {
  //   navigator.serviceWorker.register("worker.js");
  // }
  const [menus, setMenus] = useState({});
  const saved = getAuthFromLocalStorage();
  const [auth, setA] = useState(saved ?? null)
  const setAuth = (a) => {
    setA(a);
    setAuthToLocalStorage(a);
  }

  useLayoutEffect(()=>{
    const url = process.env.REACT_APP_SERVER_URL + "menu";
    axios.get(url)
      .then(response => {
          const data = response.data;
          setMenus(data);
      })
  }, [])


  return (
    <AuthContext.Provider value={{auth, setAuth}}>
        <div className="App">
            <HashRouter>
            <NavBar menus={menus?.header} />
            <div className="content">
            <Routes>
                <Route path="/" element={<Storefront />} />
                <Route path="/shop" element={<ListCategories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-success" element={<RegisterSuccess />} />
                <Route path="/c" element={<ListCategories />} />
                <Route path="/c/:alias" element={<Category />} />
                <Route path="/b/:id" element={<Brand />} />
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
                <Route path="/product_reviews/:id" element={<ProductReviews />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/product_questions/:id" element={<ProductQuestions/>} />
                <Route path="/m/:alias" element={<MenuArticle/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="*" element={<div className="my-4">Not found</div>} />
            </Routes>
            </div>
            <Footer menus={menus?.footer}/>
          </HashRouter>
      </div>
    </AuthContext.Provider>
    
  );
}

export default App;
