import { Route, Routes, useLocation } from "react-router-dom";
import Register from "../Register/Register";
import Login from "../Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../HomePage/Home";
import Contact from "../Contact/Contact";
import Product from "../Product/Product";
import About from "../About/About";
import "./Main.css";
import Pricing from "../Pricing/Pricing";

function Main() {
  return (
    <div className="main-container">
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home></Home>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default Main;
