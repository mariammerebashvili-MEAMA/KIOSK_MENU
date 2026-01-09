import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import { useTranslation } from 'react-i18next';
import prStore from "../Products/store";

import MainShape from "../../components/MainShape";

import styles from "./styles.module.css";

const PaymentSuccess = () => {  
  const dataFetchedRef = useRef(false);
  const { t } = useTranslation();

  useEffect(()=>{
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (prStore.paymentMethod !== "crypto") {
      prStore.statusInterval(localStorage.getItem("transactionId"));
    }
  },[]);

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <MainShape fill="#A0D39F" verticalPosition="bottom" horizontalPosition="right" />
                <div className={styles.topBox}>
                  <motion.h2
                    className={`${styles.title} f-lgv`}
                    variants={variants.titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('payment-success')}
                  </motion.h2>
                  <motion.div
                    className={`${styles.helperText} f-lgv`}
                    variants={variants.helperTextVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('capsules-are-being-dropped')}
                  </motion.div>
                  <motion.div 
                    className={styles.loaderBox}
                    variants={variants.loaderBoxVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className={styles.animationBox}>
                      <div className={styles.animationBoxInner}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </main>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    />
  );
};

export default PaymentSuccess;
