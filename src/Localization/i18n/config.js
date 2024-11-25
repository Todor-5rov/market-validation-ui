import i18n from "i18next";
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next } from "react-i18next";
import bgTranslation from "../Bulgarian/bg.json";
import enTranslation from "../English/en.json";

i18n.use(initReactI18next).init({
  lng: "bg",
  fallbackLng: "bg",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    bg: {
      translation: bgTranslation,
    },
    en: {
      translation: enTranslation,
    },
  },
});

export default i18n;
