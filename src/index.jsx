import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import Main from "./Components/Main/Main.jsx";
import "./Localization/i18n/config.js";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from "./Components/Repeating/Footer/Footer.jsx";
import Navbar from "./Components/Repeating/Navbar/Navbar.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));


root.render(
  <React.StrictMode>
    <Router>
      <Navbar></Navbar>
      <div className="navbar-place"></div>
      <Main/>
      <Footer></Footer>
    </Router>
  </React.StrictMode>
);
