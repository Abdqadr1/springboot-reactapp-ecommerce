import { Route, Routes } from "react-router-dom";
import ListCategories from "./list-categories";
import Login from "./login";
import NavBar from "./navbar";
import "../css/home.css"
import Category from "./category";
import Product from "./product";

const Home = () => {
    return (
      <>
        <NavBar />
        <Routes>
          <Route path="/" element={<ListCategories />} />
          <Route path="/c" element={<ListCategories />} />
          <Route path="/c/:alias" element={<Category />} />
          <Route path="/p" element={<Category />} />
          <Route path="/p/:alias" element={<Product />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
}
 
export default Home;