import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import componentsStore from "../../stores/componentsStore";
import timeoutsStore from "../../stores/timeoutsStore";
import resetAllStore from "../../stores/resetAllStore";
import { useTranslation } from 'react-i18next';
import { generateReceiptHTML } from "../../utils/htmlReceiptGenerator";

import MainShape from "../../components/MainShape";
import Button from "../../components/Button";
import TransactionIdDisplay from "../../components/TransactionIdDisplay";

import smsIconSrc from "../../assets/images/sms-icon.svg";
import downloadIconSrc from "../../assets/images/download-receipt.svg";
import styles from "./styles.module.css";

const Success = () => {  
  const dataFetchedRef = useRef(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = React.useState(false);
  const [receiptGenerated, setReceiptGenerated] = React.useState(false);
  const { t } = useTranslation();
  
  const transactionId = localStorage.getItem("transactionIdForReceipt");

  useEffect(()=>{
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    console.log(" Success page - transactionId from localStorage:", transactionId);
    console.log(" Success page - localStorage transactionId:", localStorage.getItem("transactionId"));
    console.log(" Success page - localStorage transactionIdForReceipt:", localStorage.getItem("transactionIdForReceipt"));
    
    timeoutsStore.startTwoMinuteTimeout();
  },[]);

  const handleDownloadReceipt = async () => {
    console.log('Generating receipt, transactionId:', transactionId);
    if (transactionId) {
      try {
        setIsGeneratingReceipt(true);
        console.log('Starting HTML receipt generation...');
        await generateReceiptHTML(transactionId);
        console.log('HTML receipt generation completed');
        setReceiptGenerated(true);
      } catch (error) {
        console.error('Failed to generate receipt:', error);
      } finally {
        setIsGeneratingReceipt(false);
      }
    } else {
      console.error('No transaction ID found for receipt generation');
    }
  };

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <MainShape fill="#A0D39F" verticalPosition="bottom" horizontalPosition="right" />
                <div className={styles.topBox}>
                  <motion.h2
                    className={`${styles.title} f-lgv`}
                    variants={variants.titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('success')}
                  </motion.h2>
                  <motion.div
                    className={`${styles.text}`}
                    variants={variants.textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('the-payment-was-successful')}
                  </motion.div>
                  <motion.div
                    className={`${styles.helperText} f-lgv`}
                    variants={variants.helperTextVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('collect-your-capsules-in-dropper')}
                  </motion.div>
                  
                  <TransactionIdDisplay transactionId={transactionId} />
                  
                  <div className={styles.downloadButton}>
                    <Button
                      label={
                        isGeneratingReceipt 
                          ? t('generating-receipt') || 'Generating Receipt...'
                          : receiptGenerated 
                            ? t('receipt-generated') || 'Receipt Generated ✓'
                            : t('download-receipt') || 'Download Receipt'
                      }
                      icon={downloadIconSrc}
                      animationDelay={0.5} 
                      onClick={handleDownloadReceipt}
                      disabled={isGeneratingReceipt}
                    />
                  </div>
                  {/* <div className={styles.smsButton}>
                    <Button
                      label={t('get-sms-receipt')}
                      icon={smsIconSrc}
                      animationDelay={0.55} 
                      onClick={() => {
                        timeoutsStore.clearTwoMinuteTimeout();
                        componentsStore.changePage(componentsStore.pages.receipt);
                        timeoutsStore.startReceiptPageTimeout();
                      }} 
                    />
                  </div> */}
                  <div className={styles.button}>
                    <Button 
                      label={t('home-page')}
                      classText="transparent" 
                      animationDelay={0.55} 
                      onClick={() => resetAllStore.resetAll()} 
                    />
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    />
  );
};

export default Success;