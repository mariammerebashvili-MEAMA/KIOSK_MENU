import React from "react";
import { motion } from "framer-motion";
import variants from "./variants";
import { useTranslation } from 'react-i18next';
import styles from "./styles.module.css";

const Details = ({ onClick, item }) => {  
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <motion.div
        className={styles.overlay}
        onClick={onClick}
        variants={variants.overlayVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit"
      />
      <motion.div
        className={styles.box}
        variants={variants.boxVariants} 
        initial="hidden" 
        animate="visible" 
        exit="exit"
      >
        <motion.div 
          className={styles.imgBox}
          variants={variants.imgBoxVariants} 
          initial="hidden" 
          animate="visible"
          exit="exit"
        >
          <motion.img 
            className={styles.img} 
            src={item?.imageUrl} 
            alt="" 
            variants={variants.imgVariants} 
            initial="hidden" 
            animate="visible"
          />
        </motion.div>
        <motion.div 
          className={styles.topInfo}
          variants={variants.topInfoVariants} 
          initial="hidden" 
          animate="visible"
        >
          <h2 className={`${styles.title} f-lgv`}>{item?.name}</h2>
          <p className={styles.roast}>{item?.roast}</p>
          <p className={`${styles.country} f-bold`}>{item?.regionName}</p>
        </motion.div>

        <motion.div className={styles.line} variants={variants.lineVariants} initial="hidden" animate="visible"></motion.div>

        <motion.div 
          className={styles.scroller}
          variants={variants.scrollerVariants} 
          initial="hidden" 
          animate="visible"
        >

          <div className={styles.specifications}>
            <h2 className={`${styles.title} f-lgv`}>{t('specifications')}</h2>
            {item?.productSpecifications.filter(pr => pr?.progress).map((o, index) => {
              return (
                <div className={styles.specificationCont} key={index}>
                  <div className={styles.left}>{o?.name}</div>
                    <div className={styles.center}>
                      <motion.div 
                        className={styles.progressLine} 
                        initial={{ width: 0 }} 
                        animate={{ width: parseFloat(o?.value) + "%", transition: { delay: 0.8, type: "spring", duration: 2, bounce: 0.45 } }}
                      >
                      </motion.div>
                    </div>
                  <div className={styles.right}>{parseFloat(o?.value) / 10} / {o?.maxValue / 10}</div>
                </div>
              )
            })}
          </div>

          <motion.div className={styles.line} variants={variants.lineVariants} initial="hidden" animate="visible"></motion.div>

          <div className={styles.additionalInfo}>
            {item?.productSpecifications.filter(pr => pr?.progress === false).map((o, index) => {
              return (
                <div className={styles.additionalInfoCont} key={index}>
                  <div className={styles.left}>{o?.name}</div>
                  <div className={styles.right}>{o?.value}</div>
                </div>
              )
            })}
          </div>

          <div className={styles.description}>
            <h2 className={`${styles.title} f-lgv`}>{t('description')}</h2>
            <div className={styles.text}>{item?.description}</div>
          </div>

        </motion.div>

      </motion.div>
    </React.Fragment>
  );
};

export default Details;
