import React from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import { useTranslation } from 'react-i18next';
import prStore from "../store";
// import RefundPolicySnackbar from "../../../components/RefundPolicySnackbar";

import masterCardLogoSrc from '../../../assets/images/mastercard-logo.svg'
import visaLogoSrc from '../../../assets/images/visa-logo.svg'
import applePayLogoSrc from '../../../assets/images/apple-pay-logo.svg'
import googlePayLogoSrc from '../../../assets/images/google-pay-logo.svg'
import tetherLogoSrc from '../../../assets/images/tether-logo.svg'
import litecoinLogoSrc from '../../../assets/images/litecoin-logo.svg'
import styles from "./styles.module.css";

const PaymentMethod = () => {
  const { t } = useTranslation();
  const onChangeHandler = (event) => prStore.paymentMethod = event.target.value;
  
  const handleAcknowledgeRefundPolicy = () => {
    prStore.hasAcknowledgedRefundPolicy = !prStore.hasAcknowledgedRefundPolicy;
  };

  return (
    <Observer render={() => (
      <React.Fragment>
        <motion.div
          className={styles.items}
          variants={variants.itemsVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className={styles.item} variants={variants.itemVariants}>
            <label className={styles.label} htmlFor="card">
              <div className="d-flex align-items-center">
                <input className={styles.radioInput} type="radio" id="card" name="choose-payment-method" value="card" checked={prStore.paymentMethod === "card"} onChange={onChangeHandler} />
                <div className={styles.radioIcon}></div>
                <div className={`${styles.radioTitle} f-bold`}>{t('pay-with')}</div>
              </div>
              <div className="d-flex align-items-center">
                <div className={styles.paymentImages}>
                  <img src={masterCardLogoSrc} alt="MasterCard" />
                  <img src={visaLogoSrc} alt="VISA" />
                  <img src={applePayLogoSrc} alt="Apple Pay" />
                  <img src={googlePayLogoSrc} alt="Google Pay" />
                </div>
              </div>
            </label>
          </motion.div>
          <motion.div className={styles.item} variants={variants.itemVariants}>
            <label className={styles.label} htmlFor="crypto">
              <div className="d-flex align-items-center">
                <input className={styles.radioInput} type="radio" id="crypto" name="choose-payment-method" value="crypto" checked={prStore.paymentMethod === "crypto"} onChange={onChangeHandler} />
                <div className={styles.radioIcon}></div>
                <div className={`${styles.radioTitle} f-bold`}>{t('pay-with')}</div>
              </div>
              <div className="d-flex align-items-center">
                <div className={styles.paymentImages}>
                  <img src={tetherLogoSrc} alt="Tether" />
                  <img src={litecoinLogoSrc} alt="Litecoin" />
                </div>
              </div>
            </label>
          </motion.div>
        </motion.div>
        
        {/* <RefundPolicySnackbar 
          isAcknowledged={prStore.hasAcknowledgedRefundPolicy}
          onAcknowledge={handleAcknowledgeRefundPolicy}
        /> */}
      </React.Fragment>
    )}/>
  );
};

export default PaymentMethod;
