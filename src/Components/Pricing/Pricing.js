import React, { useEffect, useState } from "react";
import "./Pricing.css";
import { auth } from "../../FireBase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next"; // Import i18next
import Navbar from "../Repeating/Navbar/Navbar";
import Footer from "../Repeating/Footer/Footer";

const Pricing = () => {
  const [userid, setUserid] = useState(null);
  const { i18n } = useTranslation(); // Use react-i18next to get the current language/locale

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserid(currentUser.uid);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Render the correct pricing table based on the current language
  const renderPricingTable = () => {
    const locale = i18n.language; // Get the current locale from i18next
    switch (locale) {
      case "bg": // Bulgarian locale
        return (
          <stripe-pricing-table
            pricing-table-id="prctbl_1QO1A4RrDgS7LfakvnB1FiKU"
            publishable-key="pk_test_51PBGdMRrDgS7LfakxKcTYPLsavUCGvmEMntAdPjJ4EPwrApAQdY5CDdOoB2xPQFLBRCozGPRoFHfx6sBObGKuCkK00TgCNUQvu"
          ></stripe-pricing-table>
        );
      case "en": // English locale
      default: // Default fallback (English)
        return (
          <stripe-pricing-table
            pricing-table-id="prctbl_1QF9wbRrDgS7LfakSNwxEhIP" // Replace with your English-specific ID if needed
            publishable-key="pk_test_51PBGdMRrDgS7LfakxKcTYPLsavUCGvmEMntAdPjJ4EPwrApAQdY5CDdOoB2xPQFLBRCozGPRoFHfx6sBObGKuCkK00TgCNUQvu"
            client-reference-id={userid}
          ></stripe-pricing-table>
        );
    }
  };

  return (
    <div>
      <Navbar />
      {renderPricingTable()}
      <Footer />
    </div>
  );
};

export default Pricing;
