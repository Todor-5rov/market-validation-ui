// Navbar.js
import React from "react";
import "./CustTextField.css"; // Ensure you create this CSS file
import { TextField, initializeIcons, IconButton } from "@fluentui/react";
import { Button } from "flowbite-react";

const CustTextField = () => {
  return (
    <div class="wrapper">
        <input type="text" placeholder="Enter your email" />
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12l14 0"></path>
                <path d="M13 18l6 -6"></path>
                <path d="M13 6l6 6"></path>
            </svg>
        </button>
    </div>
  );
};

export default CustTextField;
