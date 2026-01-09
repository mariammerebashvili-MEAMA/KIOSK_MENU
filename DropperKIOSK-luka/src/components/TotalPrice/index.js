import React from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import { useTranslation } from 'react-i18next';
import productsStore from "../../stores/productsStore";
import prStore from "../../pages/Products/store";
import Button from "../Button";
import styles from "./styles.module.css";

const TotalPrice = ({ onClick, label, tapDelayDuration }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      className={styles.totalPriceBox}
      variants={variants.totalPriceBoxVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Observer render={() => (
        productsStore.totalSelectedProductQty ?
          <motion.div
            variants={variants.leftBoxVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.label}>{t('total-price')}</div>
            <div className={`${styles.price} f-bold`}>{productsStore.totalPrice.toNumber()} {t('gel')}</div>
          </motion.div> : <div></div>
      )} />
      <div className={styles.buttonBox}>
        <Observer render={() => {
          const isDisabled = !productsStore.totalSelectedProductQty || 
            (label === t('buy') && !prStore.hasAcknowledgedRefundPolicy);
          
          return (
            <Button 
              label={label} 
              classText="filled no-paddings"
              animationDelay={1} 
              disabled={isDisabled} 
              onClick={onClick}
              tapDelay={true}
              tapDelayDuration={tapDelayDuration}
            />
          );
        }} />
      </div>
    </motion.div>
  );
}

export default TotalPrice;
