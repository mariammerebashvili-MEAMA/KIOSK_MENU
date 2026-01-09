import React from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import QuantityBox from "../../../../components/QuantityBox";
import { useTranslation } from 'react-i18next';

import infoIconSrc from "../../../../assets/images/info-icon.svg";

import styles from "./styles.module.css";

const Item = ({ onInfoClick, item, incQty, decQty }) => {
  const { t } = useTranslation();

  return (
    <Observer render={() => (
      <motion.div
        className={styles.inner}
        variants={variants.itemVariants}
      >
        <motion.div 
          className={styles.infoIconBox} 
          onClick={onInfoClick}
          variants={variants.infoIconVariants}
          whileTap="whileTap"
        >
          <img className={styles.infoIcon} src={infoIconSrc} alt={t('show-more')} />
        </motion.div>
        <div className={`${styles.item} ${item?.selectedQty ? styles.choosed : ""} ${item?.outOfStock ? styles.outOfStock : ""}`} onClick={incQty}>
          <div className={styles.productImageBox}>
            <img className={styles.productImage} src={item?.imageUrl} alt={item?.name} />
          </div>
          <h2 className={`${styles.title} f-bold`}>{item?.name}</h2>
          <p className={styles.subTitle}>{item?.roast}</p>
          <p className={styles.price}>{item?.unitPrice ? (item?.unitPrice + " " + t('gel')) : t('free')}</p>
          {!item?.outOfStock ? (
            item.selectedQty ? (
              <div className={styles.quantityBox}>
                <QuantityBox quantity={item?.selectedQty} decQty={decQty} disableInc={item?.disableInc} />
              </div>
            ) : null
          ) : (
            <div className={`${styles.outOfStockTitle} f-bold`}>{t('out-of-stock')}</div>
          )}
        </div>
      </motion.div>
    )} />
  );
};

export default Item;
