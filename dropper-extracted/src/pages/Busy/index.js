import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import resetAllStore from "../../stores/resetAllStore";
import { useTranslation } from 'react-i18next';
import timeoutsStore from "../../stores/timeoutsStore";

import MainShape from "../../components/MainShape";
import Button from "../../components/Button";

import styles from "./styles.module.css";

const Busy = () => {
  const dataFetchedRef = useRef(false);
  const { t } = useTranslation();

  useEffect(()=>{
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    timeoutsStore.statusPagesTimeout();
  },[]);

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <MainShape fill="#000" verticalPosition="bottom" horizontalPosition="right" />
                <div className={styles.topBox}>
                  <motion.h2
                    className={`${styles.title} f-lgv`}
                    variants={variants.titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('device-is-busy')}
                  </motion.h2>
                  <div className={styles.button}>
                    <Button 
                      label={t('home-page')} 
                      classText="transparent" 
                      animationDelay={0.25} 
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

export default Busy;