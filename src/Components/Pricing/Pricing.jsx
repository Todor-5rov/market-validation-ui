import React from "react";
import "./Pricing.css";
import Navbar from "../Repeating/Navbar/Navbar";
import { usePricing } from "./pricingFunctions";

const Pricing = () => {
  const { renderPricingTable } = usePricing();

  return (
    <div className="wrapper">
      {renderPricingTable()}
    </div>
  );
};

export default Pricing;