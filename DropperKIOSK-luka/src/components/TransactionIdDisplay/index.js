import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import styles from "./styles.module.css";

const TransactionIdDisplay = ({ transactionId }) => {
  const { t } = useTranslation();

  if (!transactionId) return null;

  return (
    <motion.div
      className={styles.transactionIdContainer}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.transactionIdContent}>
        <div className={styles.transactionIdLabel}>
          {t('transaction-id') || 'Transaction ID'}
        </div>
        <div className={styles.transactionIdValue}>
          {transactionId}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionIdDisplay;
