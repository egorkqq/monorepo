import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const importTranslation = (language: string) => import(`../locales/${language}.json`);

i18n
  .use(resourcesToBackend(importTranslation))
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true, // import.meta.env.DEV,

    detection: {
      convertDetectedLanguage: (lng) => lng.split("-")[0] || lng,
    },

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lang) => {
  document.documentElement.setAttribute("lang", lang);
});

i18n.services.formatter?.add("notNaN", (value) => {
  if (value === "NaN" || value === "не число") {
    return "";
  }

  return value + "";
});

i18n.services.formatter?.add("rightSpace", (value) => {
  if (value === undefined || value === "") {
    return "";
  }

  return `${value} `;
});

export default i18n;
