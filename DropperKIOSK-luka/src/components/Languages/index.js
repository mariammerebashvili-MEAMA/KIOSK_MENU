import React from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import productsStore from "../../stores/productsStore";
import resetAllStore from '../../stores/resetAllStore';
import { useTranslation } from 'react-i18next';
import styles from "./styles.module.css";

const Languages = () => {
  const { t, i18n } = useTranslation();

  const setHtmlLangAttr = (lang) => document.documentElement.setAttribute('lang', lang);

  return (
    <div className={styles.langTabs}>
      <div 
        className={`${styles.langTab} ${i18n.language === "en" ? styles.active : ""}`} 
        onClick={() => {
          i18n.changeLanguage('en')
          setHtmlLangAttr('en');
          resetAllStore.resetAll()
          productsStore.getAllProducts()
        }}
      >
        <span className={`${styles.langTabTitle} f-bold`}>{t('eng')}</span>
        {i18n.language === "en" && <motion.div className={styles.langTabBg} layoutId="langTabBg" transition={variants.langTabBgVariants} />}
      </div>
      <div 
        className={`${styles.langTab} ${i18n.language === "ka" ? styles.active : ""}`} 
        onClick={() => {
          i18n.changeLanguage('ka')
          setHtmlLangAttr('ka');
          resetAllStore.resetAll()
          productsStore.getAllProducts()
        }}
      >
        <span className={`${styles.langTabTitle} f-bold`}>{t('geo')}</span>
        {i18n.language === "ka" && <motion.div className={styles.langTabBg} layoutId="langTabBg" transition={variants.langTabBgVariants} />}
      </div>
    </div>
  );
}

export default Languages;