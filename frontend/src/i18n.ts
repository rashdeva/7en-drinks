import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const customDetector = {
  name: "customDetector",
  lookup() {
    const language = navigator.language;
    return language.includes("-") ? language.split("-")[0] : language;
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(customDetector);

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    ns: ["translation"],
    defaultNS: "translation",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
