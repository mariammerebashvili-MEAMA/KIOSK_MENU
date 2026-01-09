import React, { useState, useEffect, useContext, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import Select from 'react-select'
import variants from "./variants";
import Button from "../../components/Button";
import PrivacyPolicy from "../../components/PrivacyPolicy";
import ReceiptStore from "./store";
import resetAllStore from "../../stores/resetAllStore";
import timeoutsStore from "../../stores/timeoutsStore";
import { useTranslation } from 'react-i18next';

import exitIconSrc from "../../assets/images/exit-icon.svg";
import checkmarkSrc from "../../assets/images/checkmark.svg";

import styles from "./styles.module.css";

const Receipt = () => {
  const { t } = useTranslation();
  const receiptStore = useContext(ReceiptStore);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [defaultValue, setDefaultValue] = useState();
  const [currentValue, setCurrentValue] = useState();
  const [enableSendBtn, setEnableSendBtn] = useState(false);

  const keyTap = (x) => setPhoneNumber(phoneNumber + x);
  const removeLastNum = () => setPhoneNumber(phoneNumber.slice(0, -1));
  const validatePhone = (num, regEx) => num.match(regEx) ? setEnableSendBtn(true) : setEnableSendBtn(false);
  
  const onChangeIndex = (e) => {
    setDefaultValue(e);
    setCurrentValue(receiptStore.phoneMasksData.find(o => o.value === e.value));
  }

  const sendReceiptHandler = () => {
    receiptStore.sendSMS(phoneNumber, currentValue.value);
  }

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    phoneNumber && currentValue && validatePhone(phoneNumber, currentValue.regEx);
  }, [phoneNumber, currentValue]);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    
    receiptStore.getPhoneMasks().then(o => {
      setCurrentValue(receiptStore.defaultOption);
      setDefaultValue(receiptStore.defaultOption);
    });

    return () => {
      receiptStore.phoneMasksData = [];
    }
  },[]);

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div 
            className={styles.exitBtn} 
            variants={variants.exitBtnVariants} 
            initial="hidden"
            animate="visible"
            exit="exit"
            whileTap="whileTap"
            onClick={(e) => {
              e.stopPropagation();
              resetAllStore.resetAll();
            }}
          >
            <img src={exitIconSrc} alt="Exit" />
          </motion.div>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <div className={styles.topBox}>
                  <motion.h2
                    className={`${styles.title} f-lgv`}
                    variants={variants.titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('your-mobile-number')}
                  </motion.h2>
                  <motion.div
                    className={`${styles.text}`}
                    variants={variants.textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t('indicate-your-mobile-number-to-get-the-electronic-receipt')}
                  </motion.div>
                  <div className={styles.privacyPolicyButton}>
                    <Button 
                      label={t('privacy-policy')}
                      classText="transparent small" 
                      animationDelay={0.4} 
                      onClick={() => {
                        setOpenPrivacyPolicy(true);
                        timeoutsStore.resetReceiptPageTimeouts();
                      }} 
                    />
                  </div>
                  <motion.div 
                    className={styles.numberBox}
                    variants={variants.numberBoxVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className={styles.select}>
                      <Select 
                        key={defaultValue?.value}
                        classNamePrefix="index-select" 
                        isSearchable={false} 
                        defaultValue={defaultValue}
                        onChange={onChangeIndex}
                        options={receiptStore.phoneMasksData}
                      />
                    </div>
                    <div className={styles.phoneNumbers}>
                      {phoneNumber}
                    </div>
                  </motion.div>
                  <motion.div 
                    className={styles.agreeCheckbox}
                    variants={variants.agreeCheckboxVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <img src={checkmarkSrc} alt="Agree" />
                    {t('privacy-policy-agree-text')}
                  </motion.div>
                  <div className={`${styles.button}`}>
                    <Button
                      disabled={enableSendBtn ? false : true}
                      label={t('send')}
                      animationDelay={0.4} 
                      onClick={() => sendReceiptHandler()} 
                      tapDelay={true}
                    />
                  </div>
                </div>
                <motion.div 
                  className={styles.keyboardBox}
                  variants={variants.keyboardBoxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className={styles.keyboardItem} onClick={()=> keyTap('1')}>1</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('2')}>2</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('3')}>3</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('4')}>4</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('5')}>5</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('6')}>6</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('7')}>7</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('8')}>8</div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('9')}>9</div>
                  <div className={`${styles.keyboardItem} ${styles.disabled}`}></div>
                  <div className={styles.keyboardItem} onClick={()=> keyTap('0')}>0</div>
                  <div className={styles.keyboardItem} onClick={() => removeLastNum()}>
                    <svg className={styles.keyboardRemoveIcon} viewBox="0 0 34 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30.1221 5.51851e-06H9.54329C8.33206 -0.0020575 7.18914 0.574405 6.45396 1.55813L0.804987 9.08396H0.805276C0.283028 9.77654 0 10.6259 0 11.5C0 12.3741 0.28305 13.2235 0.805276 13.916L6.45425 21.4419H6.45396C7.18915 22.4256 8.33206 23.0021 9.54329 23H30.1221C31.1507 23 32.1369 22.5827 32.8643 21.8397C33.5914 21.097 34 20.0894 34 19.039V3.96097C34 2.9106 33.5914 1.903 32.8643 1.1603C32.1369 0.417325 31.1507 5.51851e-06 30.1221 5.51851e-06ZM23.6719 14.141C23.9166 14.3889 24.0542 14.7263 24.0542 15.0785C24.0542 15.4304 23.9166 15.7679 23.6719 16.016C23.4278 16.263 23.0977 16.4009 22.7541 16.3989C22.4104 16.4009 22.0803 16.263 21.8362 16.016L19.2509 13.3754L16.6657 16.016C16.423 16.2659 16.0926 16.4065 15.7478 16.4065C15.4033 16.4065 15.0729 16.2659 14.8303 16.016C14.5853 15.7679 14.4477 15.4304 14.4477 15.0785C14.4477 14.7263 14.5853 14.3889 14.8303 14.141L17.4155 11.5004L14.8303 8.85974C14.5022 8.52494 14.3741 8.03661 14.4941 7.57917C14.6141 7.12174 14.9641 6.76427 15.412 6.64167C15.8598 6.51907 16.3379 6.64992 16.6657 6.98472L19.2509 9.62536L21.8362 6.98472C22.1643 6.64993 22.6421 6.51907 23.0899 6.64167C23.538 6.76427 23.8877 7.12176 24.0078 7.57917C24.1278 8.03659 23.9997 8.5249 23.6719 8.85974L21.0866 11.5004L23.6719 14.141Z" fill="black"/>
                    </svg>
                  </div>
                </motion.div>
              </main>
            </div>
          </motion.div>
          <PrivacyPolicy 
            isOpen={openPrivacyPolicy} 
            onClose={() => {
              setOpenPrivacyPolicy(false);
              timeoutsStore.resetReceiptPageTimeouts();
            }} 
          />
        </React.Fragment>
      )}
    />
  );
};

export default Receipt;