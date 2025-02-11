import { useEffect, useState } from "react";
import { auth } from "../../FireBase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

export const usePricing = () => {
  const [userid, setUserid] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserid(currentUser.uid);
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const renderPricingTable = () => {
    const locale = i18n.language;

    if (locale === "bg") {
      return (
        <stripe-pricing-table
          pricing-table-id="prctbl_1QO1A4RrDgS7LfakvnB1FiKU"
          publishable-key="pk_test_51PBGdMRrDgS7LfakxKcTYPLsavUCGvmEMntAdPjJ4EPwrApAQdY5CDdOoB2xPQFLBRCozGPRoFHfx6sBObGKuCkK00TgCNUQvu"
          client-reference-id={userid}
        ></stripe-pricing-table>
      );
    } else {
      // Default to English
      return (
        <stripe-pricing-table
          pricing-table-id="prctbl_1QF9wbRrDgS7LfakSNwxEhIP"
          publishable-key="pk_test_51PBGdMRrDgS7LfakxKcTYPLsavUCGvmEMntAdPjJ4EPwrApAQdY5CDdOoB2xPQFLBRCozGPRoFHfx6sBObGKuCkK00TgCNUQvu"
          client-reference-id={userid}
        ></stripe-pricing-table>
      );
    }
  };

  return { userid, renderPricingTable };
};
