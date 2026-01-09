import React, { useState } from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import merge from 'lodash/merge';
import styles from "./styles.module.css";

const Button = ({ label, icon, classText, animationDelay, onClick, disabled, tapDelay, tapDelayDuration = 600, proccessing }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <motion.div 
      className={`${styles.buttonBox}`}
      variants={merge(variants.buttonBoxVariants, {visible: { transition: { delay: animationDelay}}})}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className={`
          ${styles.button} 
          ${classText ? classText : ""} 
          ${disabled ? styles.disabled : ""} 
          ${loading || proccessing ? styles.loading : ""} 
          f-bold
        `}
        variants={variants.buttonVariants}
        whileTap="whileTap"
        onClick={() => {
          onClick();
          tapDelay && setLoading(true);
          tapDelay && setTimeout(() => setLoading(false), tapDelayDuration);
        }}
      >
        {
          loading || proccessing ? (
            <div className={`${styles.loader}`}>
              <div className={styles.bounce}>
                <div className={styles.bounce1}></div>
                <div className={styles.bounce2}></div>
                <div className={styles.bounce3}></div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              {icon && <img src={icon} className={styles.icon} alt="" />}
              {label ?? ""}
            </React.Fragment>
          )
        }
      </motion.div>
    </motion.div>
  );
}

export default Button;
