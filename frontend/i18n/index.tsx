import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      onboarding: {
        title: "Welcome back, Kaniz",
        subtitle: "Your maternal care companion\nfor the first 42 days",
        chooseLanguage: "Choose language",
        getStarted: "Get Started",
        footer: "By continuing you agree to our care terms.",
      },
    },
  },
  bn: {
    translation: {
      onboarding: {
        title: "স্বাগতম, কানিজ",
        subtitle: "প্রসবের পর প্রথম ৪২ দিনের\nমাতৃসেবা সহকারী",
        chooseLanguage: "ভাষা নির্বাচন করুন",
        getStarted: "শুরু করুন",
        footer: "চালিয়ে গেলে আপনি আমাদের যত্নের শর্তে সম্মত হচ্ছেন।",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0]?.languageCode || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;