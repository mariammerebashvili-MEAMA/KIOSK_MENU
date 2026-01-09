import React from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import timeoutsStore from "../../stores/timeoutsStore";

import minusIconSrc from "../../assets/images/minus-icon.svg";
import plusIconSrc from "../../assets/images/plus-icon.svg";

import styles from "./styles.module.css";

const QuantityBox = ({ quantity, disableInc, decQty }) => {
  return (
    <motion.div 
      className={styles.quantityBox}
      variants={variants.quantityBoxVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className={`${styles.quantityBtn} ${quantity ? "" : styles.disabled}`}
        variants={variants.quantityBtnVariants}
        whileTap="whileTap"
        onClick={(e) => {
          e.stopPropagation();
          decQty();
        }} 
      >
        <img className={styles.quantityBtnIcon} src={minusIconSrc} alt="Minus" />
      </motion.div>
      <div className={`${styles.inputField} f-bold`}>{quantity ?? 0}</div>
      <motion.div 
        className={`${styles.quantityBtn} ${disableInc ? styles.disabled : ""}`}
        variants={variants.quantityBtnVariants}
        whileTap="whileTap"
      >
        <img className={styles.quantityBtnIcon} src={plusIconSrc} alt="Plus" />
      </motion.div>
    </motion.div>
  );
}

export default QuantityBox;
