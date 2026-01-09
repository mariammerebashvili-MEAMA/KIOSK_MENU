import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import componentsStore from "./stores/componentsStore";
import loaderStore from "./stores/loaderStore";
import productsStore from "./stores/productsStore";
import resetAllStore from "./stores/resetAllStore";
import Header from "./components/Header";
import Loader from "./components/Loader";
import BusyLayer from "./components/BusyLayer";
import useIsWebView from "./hooks/useIsWebView";

import "./assets/css/normalize.css";
import "./assets/css/grids.css";
import "./assets/css/styles.css";

const App = () => {
  const isWebView = useIsWebView();

  const { t, i18n } = useTranslation();
  const dataFetchedRef = useRef(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
    resetAllStore.resetAll();
    productsStore.getAllProducts();
  };

  const clear = () => {
    let params = new URLSearchParams(window.location.search);

    localStorage.removeItem("transactionId");
    localStorage.removeItem("transactionIdForReceipt");
    
    params.delete("status");
    const search = params.toString();
    const url = `${window.location.pathname}?${search}`;
    window.history.replaceState(null, null, url);
  }

  useEffect(() => {
    (function () {
      window.parent.addEventListener("message", function (event) {
        if (event.data.event === "setLanguage") {
          if (event.data.payload === "en" || event.data.payload === "ka") {
            changeLanguage(event.data.payload);
          } else {
            changeLanguage("en");
          }
        }
      });
    })();
  }, []);

  useEffect(() => {
    const setWindowHeight = () =>
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01 - 0.01}px`
      );
    setWindowHeight();
    window.addEventListener("resize", setWindowHeight);
    return () => window.removeEventListener("resize", setWindowHeight);
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    // Ensure qrCode is present immediately (handled inside productsStore)
    let params = new URLSearchParams(window.location.search);
    productsStore.getQRCode();

    // Handle UFC return parameters
    // Note: UFC's confirm parameter is unreliable - we trust trans_id instead
    const ufcConfirm = params.get("Ucaf_Cardholder_Confirm");
    const transId = params.get("trans_id");
    const errorParam = params.get("error");
    const localTransactionId = localStorage.getItem("transactionId");
    
    console.log("UFC Return Debug:", {
      ufcConfirm,
      transId,
      errorParam,
      localTransactionId,
      allParams: Object.fromEntries(params.entries())
    });
    
    // Log payment status for debugging
    if (ufcConfirm === "0") {
      console.warn("Payment NOT confirmed by UFC (Ucaf_Cardholder_Confirm=0)");
      console.warn("This means payment was either cancelled, declined, or not completed");
    } else if (ufcConfirm === "1") {
      console.log("Payment confirmed by UFC (Ucaf_Cardholder_Confirm=1)");
    }
    
    // Check for error parameter first - if present, go to error page regardless of trans_id
    if (errorParam) {
      console.log("Error parameter detected:", errorParam);
      console.log("Clearing all intervals and redirecting to error page due to payment failure");
      resetAllStore.resetAll(); // Clear all intervals and reset state
      componentsStore.changePage(componentsStore.pages.error);
    }
    // Handle UFC payment return - only if no error parameter
    else if (transId) {
      // Store UFC transaction ID if no local one exists
      if (!localTransactionId) {
        localStorage.setItem("transactionId", transId);
        localStorage.setItem("transactionIdForReceipt", transId);
        console.log("Using UFC trans_id as transactionId:", transId);
      }
      
        // Trust trans_id over UFC's unreliable confirm parameter
        // Backend should verify actual payment status via UFC API/webhooks
        console.log("UFC provided trans_id - Trusting transaction and proceeding to success");
        console.log("UFC confirm status:", ufcConfirm, "(ignored - unreliable)");
        console.log("Backend should verify payment status independently");
        componentsStore.changePage(componentsStore.pages.success);
    } else {
      console.log("No transId found, clearing");
      clear();
    }
  }, []);

  return (
    <React.Fragment>
      <div className={`page-wrap ${isWebView ? 'is-web-view' : ''}`}>
        {!isWebView && <Header />}

        <Observer
          render={() => (
            <AnimatePresence mode="wait">
              {componentsStore.currentComponent}
            </AnimatePresence>
          )}
        />


        <Observer render={() => <BusyLayer key={componentsStore.busy} />} />
        <Observer
          render={() => (
            <AnimatePresence>
              {loaderStore.loader ? <Loader /> : null}
            </AnimatePresence>
          )}
        />
      </div>
      <div id="landscapeScreen" className="f-lgv">
        {t("landscape-version-text")}
      </div>
    </React.Fragment>
  );
};

export default App;