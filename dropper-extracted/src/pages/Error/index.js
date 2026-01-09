import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import resetAllStore from "../../stores/resetAllStore";
import { useTranslation } from 'react-i18next';
import timeoutsStore from "../../stores/timeoutsStore";

import MainShape from "../../components/MainShape";
import Button from "../../components/Button";

import errorIconSrc from "../../assets/images/error-icon.svg";
import styles from "./styles.module.css";

const Error = () => {
  const dataFetchedRef = useRef(false);
  const { t } = useTranslation();

  useEffect(()=>{
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    // Clean up URL parameters and localStorage for failed payments
    const clear = () => {
      let params = new URLSearchParams(window.location.search);
      localStorage.removeItem("transactionId");
      localStorage.removeItem("transactionIdForReceipt");
      
      params.delete("status");
      params.delete("Ucaf_Cardholder_Confirm");
      params.delete("trans_id");
      const search = params.toString();
      const url = `${window.location.pathname}?${search}`;
      window.history.replaceState(null, null, url);
    };
    
    clear();
    timeoutsStore.statusPagesTimeout();
  },[]);

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <MainShape fill="#FC3E3A" verticalPosition="bottom" horizontalPosition="right" />
                <div className={styles.topBox}>
                  <motion.img
                    src={errorIconSrc}
                    className={`${styles.icon} f-lgv`}
                    variants={variants.iconVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                  <motion.h2
                    className={`${styles.title} f-lgv`}
                    variants={variants.titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('error')}
                  </motion.h2>
                  <motion.div
                    className={`${styles.text}`}
                    variants={variants.textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('something-went-wrong')}
                  </motion.div>
                  <div className={styles.button}>
                    <Button 
                      label={t('home-page')}
                      classText="transparent" 
                      animationDelay={0.40} 
                      onClick={() => resetAllStore.resetAll()} 
                    />
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    />
  );
};

export default Error;
