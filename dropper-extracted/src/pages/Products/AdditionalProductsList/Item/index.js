import React from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import QuantityBox from "../../../../components/QuantityBox";
import { useTranslation } from 'react-i18next';

import styles from "./styles.module.css";

const Item = ({ item, incQty, decQty }) => {
  const { t } = useTranslation();
  return (
    <Observer render={() => (
      <motion.div
        className={styles.inner}
        variants={variants.itemVariants}
      >
        <div className={`${styles.item}`} onClick={incQty}>
          <div className={styles.productImageBox}>
            <img className={styles.productImage} src={item?.imageUrl} alt={item?.name} />
          </div>
          <div className={styles.peoductContentContainer}>
            <h2 className={`${styles.title} f-bold`}>{item?.name}</h2>
            <div className={styles.productPrice}>{item?.unitPrice ? (item?.unitPrice + " " + t('gel')) : t('free')}</div>
          </div>
          <div className={styles.quantityBox}>
            <QuantityBox quantity={item?.selectedQty} decQty={decQty} disableInc={item?.disableInc} />
          </div>
        </div>
      </motion.div>
    )} />
  );
};

export default Item;
