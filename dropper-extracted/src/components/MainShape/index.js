import React from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import merge from 'lodash/merge';
import styles from "./styles.module.css";

const MainShape = ({ fill, verticalPosition, horizontalPosition, style = null}) => {
  return (
    <motion.svg 
      viewBox="0 0 600 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={`${styles.shape} ${verticalPosition ? verticalPosition : ""} ${horizontalPosition ? horizontalPosition : ""}`} 
      variants={merge(variants.svgVariants, {visible: {originX: horizontalPosition === "left" ? 0 : 1}})}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <path 
        fill={fill ? fill : "#000"}
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M600 300C520.435 300 444.129 268.395 387.868 212.133C331.607 155.871 300 79.5664 300 0C300 79.5664 268.393 155.871 212.132 212.133C155.871 268.391 79.5649 300 0 300C79.5649 300 155.871 331.605 212.132 387.867C268.393 444.129 300 520.434 300 600C300 520.434 331.607 444.129 387.868 387.867C444.129 331.609 520.435 300 600 300Z" 
      />
    </motion.svg>
  );
}

export default MainShape;
