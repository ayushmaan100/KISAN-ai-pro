import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your JSON files
import enJSON from './locales/en/translation.json';
import hiJSON from './locales/hi/translation.json';

i18n
  .use(LanguageDetector) // Detects language from localStorage/navigator
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enJSON },
      hi: { translation: hiJSON }
    },
    fallbackLng: 'en', // Default language if detection fails
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Cache user language in localStorage
    }
  });

export default i18n;