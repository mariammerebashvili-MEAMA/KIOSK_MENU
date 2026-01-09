import React from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import logoSrc from "../../assets/images/logo-small.svg";
import styles from "./styles.module.css";

const Header = () => {
  return (
    <React.Fragment>
      <header className={styles.header}>
        <div className={styles.logo}>
          <motion.img 
            src={logoSrc} 
            alt="Meama" 
            className={styles.logoImg} 
            variants={variants.logoVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap="whileTap"
          />
        </div>
      </header>
    </React.Fragment>
  );
}

export default Header;
