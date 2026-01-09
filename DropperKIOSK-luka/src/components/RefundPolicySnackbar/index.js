import React from "react";
import { motion } from "framer-motion";
import checkmarkSrc from "../../assets/images/snackbar-checkmark.png";
import warningIconSrc from "../../assets/images/snackbar-warning.svg";
import styles from "./styles.module.css";

const RefundPolicySnackbar = ({ isAcknowledged, onAcknowledge }) => {
  // Self-contained translations - no dependency on external translation files
  const translations = {
    en: 'Refunds are only processed with a valid transaction ID. Please save it after purchase.',
    ka: 'თანხის დაბრუნება შესაძლებელია მხოლოდ ვალიდური ტრანზაქციის ID-ის მეშვეობით. გთხოვთ, შეინახოთ.'
  };

  // Get current language from multiple sources
  const getCurrentLanguage = () => {
    try {
      // Try to get language from i18n if available
      if (typeof window !== 'undefined' && window.i18n) {
        const i18nLang = window.i18n.language;
        if (i18nLang && (i18nLang === 'en' || i18nLang === 'ka')) {
          return i18nLang;
        }
      }
      
      // Try to get from HTML lang attribute
      const htmlLang = document.documentElement.getAttribute('lang');
      if (htmlLang && (htmlLang === 'en' || htmlLang === 'ka')) {
        return htmlLang;
      }
      
      // Try to get from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && (urlLang === 'en' || urlLang === 'ka')) {
        return urlLang;
      }
      
      // Default to English
      return 'en';
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en';
    }
  };

  // Get the appropriate translation
  const getRefundPolicyText = () => {
    const currentLang = getCurrentLanguage();
    return translations[currentLang] || translations.en;
  };

  return (
    <motion.div
      className={styles.snackbar}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.alertIcon}>
        <img src={warningIconSrc} alt="Warning" />
      </div>
      <div className={styles.alertText}>
        {getRefundPolicyText()}
      </div>
      <div 
        className={`${styles.acknowledgeButton} ${isAcknowledged ? styles.acknowledged : ''}`}
        onClick={onAcknowledge}
      >
        {isAcknowledged ? (
          <img src={checkmarkSrc} alt="Acknowledged" />
        ) : (
          <div className={styles.checkCircle}></div>
        )}
      </div>
    </motion.div>
  );
};

export default RefundPolicySnackbar;
