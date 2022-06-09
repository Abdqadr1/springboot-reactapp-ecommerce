import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
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

function App() {

  const {COPYRIGHT} = useSettings();

  return (
    <div className="App">
      <NavBar />
      <div className="content">
          <BrowserRouter>
          <Routes>
              <Route path="/" element={<ListCategories />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-success" element={<RegisterSuccess />} />
              <Route path="/c" element={<ListCategories />} />
              <Route path="/c/:alias" element={<Category />} />
              <Route path="/p" element={<Category />} />
              <Route path="/p/:alias" element={<Product />} />
              <Route path="/p/search/:keyword" element={<ProductSearch />} />
              <Route path="*" element={<div className="my-4">Not found</div>} />
          </Routes>
        </BrowserRouter>
      </div>
      
        <footer className="bg-dark py-3 text-light fw-bold">{COPYRIGHT ?? ""}</footer>
    </div>
  );
}

export default App;
