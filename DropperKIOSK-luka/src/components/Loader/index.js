import React from "react";
import { motion } from "framer-motion";
// import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/loading';
import styles from "./styles.module.css";

const Loader = ({ label }) => {
  // const options = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData
  // };

  return (
    <motion.div 
      className={styles.loader} 
      initial={{ opacity: 0, duration: 0.2 }} 
      animate={{ 
        opacity: 1,
        duration: 0.2,
        transition: { delay: 0.3, duration: 0.2 }
      }} 
      exit={{ opacity: 0, duration: 0.2 }}
    >
      <div className={styles.box}>
        {/* <Lottie id="lottie-logo-animation" options={options} /> */}
        <div className={styles.label}>{label ?? ""}</div>
      </div>
    </motion.div>
  );
};

export default Loader;
