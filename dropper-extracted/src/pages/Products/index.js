import React, { useState, useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion, AnimatePresence } from "framer-motion";
import variants from "./variants";
import productsStore from "../../stores/productsStore";
import componentsStore from "../../stores/componentsStore";
import prStore from "./store";
import { useTranslation } from 'react-i18next';
import Languages from "../../components/Languages";
import PageTitle from "../../components/PageTitle";
import ProductsList from "./ProductsList";
import AdditionalProductsList from "./AdditionalProductsList";
import PaymentMethod from "./PaymentMethod";
import TotalPrice from "../../components/TotalPrice";
import CatalogLoader from "../../components/CatalogLoader";
import useIsWebView from '../../hooks/useIsWebView';
import backArrowSrc from "../../assets/images/back-arrow.svg";

import styles from "./styles.module.css";
// import AppDownloadPopupComponent from "../AppDownloadPopup/AppDownloadPopupComponent";
import RafflePopup from "../../components/RafflePopup";

const Products = () => {
  const isWebView = useIsWebView();
  const dataFetchedRef = useRef(false);

  const { t, i18n } = useTranslation();

  const tabs = [
    { id: 0, label: t('select-capsules'), name: "productsList", component: <ProductsList /> },
    { id: 1, label: t('sugar-and-cup'), name: "additionalProductsList", component: <AdditionalProductsList /> },
    { id: 2, label: t('payment-method'), name: "paymentMethod", component: <PaymentMethod /> }
  ]

  const [selectedTabName, setSelectedTabName] = useState(tabs[0]?.name);
  const [selectedTabComponent, setSelectedTabComponent] = useState(tabs[0]?.component);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  useEffect(() => {
    selectedTabName === tabs[2]?.name ? setShowPaymentMethod(true) : setShowPaymentMethod(false);
    return () => {
      setShowPaymentMethod(false);
    }
  }, [selectedTabName]);
  
  const currentTabHandler = (tabName, tabComponent) => {
    setSelectedTabName(tabName);
    setSelectedTabComponent(tabComponent);
    setTimeout(() => window.scrollTo(0, 0), 200);
  }

  const nextStepHandler = () => {
    if (selectedTabName === tabs[0]?.name) {
      if (productsStore.additionalProductsData.length !== 0 && productsStore.additionalProductsData.products) {
        currentTabHandler(tabs[1].name, tabs[1].component);
      } else {
        if (productsStore.totalPrice.toNumber() === 0) {
          prStore.createOrder();
        } else {
          currentTabHandler(tabs[2].name, tabs[2].component);
        }
      }
    } else if (selectedTabName === tabs[1]?.name) {
      if (productsStore.totalPrice.toNumber() === 0) {
        prStore.createOrder();
      } else {
        currentTabHandler(tabs[2].name, tabs[2].component);
      }
    } else if (selectedTabName === tabs[2]?.name) {
      if (!prStore.hasAcknowledgedRefundPolicy) {
        return;
      }
      
      if (prStore.paymentMethod === 'card') {
        prStore.createOrder();
      } else if (prStore.paymentMethod === 'crypto') {
        componentsStore.changePage(componentsStore.pages.cryptoPayment);
      }
    }
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    productsStore.getAllProducts();
    return () => productsStore.data = [];
  }, []);
  
  useEffect(() => {
    return () => {
      setSelectedTabName(tabs[0]?.name);
      setSelectedTabComponent(tabs[0]?.component);
      setShowPaymentMethod(false);
    }
  }, [i18n.language]);

  return (
    <motion.div 
      variants={variants.pageVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className={styles.pageProducts}
    >
      {!isWebView &&
        <AnimatePresence mode='wait'>
          <motion.div variants={variants.languagesVariants} initial="hidden" animate="visible" exit="exit" key={'languagesKey'}>
            <Languages />
          </motion.div>
        </AnimatePresence>
      }
      
      <div className="top-fixed-content">
        <RafflePopup />
        {/* <AppDownloadPopupComponent /> */}
        
        <AnimatePresence mode='wait'>
          {tabs.map(item => (
            selectedTabName === item?.name && 
              <motion.div variants={variants.pageTitleVariants} initial="hidden" animate="visible" exit="exit" key={selectedTabName}>
                <PageTitle label={item?.label} />
              </motion.div>
          ))}
        </AnimatePresence>

        <Observer render={() => (
          <AnimatePresence mode='wait'>
            {!showPaymentMethod ?
              productsStore.additionalProductsData.length !== 0 ?
                <motion.div 
                  key="tabs"
                  className={styles.tabs}
                  variants={variants.tabsVariants}
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  {tabs.slice(0, -1).map((item, index) => (
                    <Observer key={index} render={() => (
                      <div 
                        key={item.id}
                        className={`
                          ${styles.tab} 
                          ${selectedTabName === tabs[item.id].name ? styles.active : ""} 
                          ${(!productsStore.totalSelectedProductQty && item.id === 1) ? styles.disabled : ""} 
                          f-bold
                        `} 
                        onClick={() => currentTabHandler(tabs[item.id].name, tabs[item.id].component)}
                      >
                        <span className={styles.tabTitle}>{item.label ?? ""}</span>
                        {selectedTabName === tabs[item.id].name && 
                          <motion.div className={styles.tabBg} layoutId="tabBg" transition={variants.tabBgVariants} />
                        }
                      </div>
                    )} />
                  ))}
                </motion.div> : null
              :
              <motion.div
                key="back-btn"
                className={styles.backBtn}
                variants={variants.backBtnVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileTap="whileTap"
                onClick={() => currentTabHandler(tabs[0].name, tabs[0].component)}
              >
                <img src={backArrowSrc} alt={t('back')} />{t('back')}
              </motion.div>
            }
          </AnimatePresence>
        )} />
      </div>
      <main>
        <div className={`page-content`}>
          <Observer render={() => (
            productsStore.catalogLoader ? (
              <CatalogLoader />
            ) : (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedTabName ? selectedTabName : "empty"}
                  variants={variants.tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {selectedTabComponent}
                </motion.div>
              </AnimatePresence>
            )
          )} />
        </div>
      </main>
      <TotalPrice 
        label={selectedTabName === tabs[0]?.name ? t('next') : (selectedTabName === tabs[1]?.name ? t('next') : t('buy'))}
        onClick={() => nextStepHandler()} 
        tapDelayDuration={selectedTabName === tabs[2]?.name ? 100000 : 600}
      />
    </motion.div>
  );
};

export default Products;
