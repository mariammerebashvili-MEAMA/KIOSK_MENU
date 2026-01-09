import React from "react";
import Sheet from 'react-modal-sheet';
import { motion } from "framer-motion";
import variants from "./variants";
import { useTranslation } from 'react-i18next';

import styles from "./styles.module.css";

const PrivacyPolicy = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  isOpen 
    ? document.getElementsByTagName('body')[0].classList.add('disable-scroll')
    : document.getElementsByTagName('body')[0].classList.remove('disable-scroll')
  
  const springConfig = {
    stiffness: 200,
    damping: 30,
    mass: 0.1
  }

  return (
    <Sheet isOpen={isOpen} onClose={onClose} snapPoints={[0.84]} springConfig={springConfig} className={styles.sheetModal}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className={styles.topBox}>
            <motion.h2 
              className={`${styles.mainTitle} f-lgv`}
              variants={variants.mainTitleVariants}
              initial="hidden"
              animate="visible"
            >
              {t('privacy-policy')}
            </motion.h2>
          </div>
          <motion.div 
            className={styles.textBox}
            variants={variants.textBoxVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.text} dangerouslySetInnerHTML={{__html: t('privacy-policy-text') }}></div>
          </motion.div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onClick={() => onClose()} />
    </Sheet>
  );
}

export default PrivacyPolicy;
