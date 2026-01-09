import { makeAutoObservable } from "mobx";
import localStorageStore from "../../stores/localStorageStore";
import componentsStore from "../../stores/componentsStore";
import productsStore from "../../stores/productsStore";
import useIsWebView from '../../hooks/useIsWebView'

import ApiManager from "../../ApiManager/APIManager";

export const PrStore = class {
  isWebView = useIsWebView();

  transactionStatusInterval;
  clearTransactionStatusInterval;
  cryptoOrderInterval;
  clearCryptoOrderInterval
  paymentMethod = 'card';
  cryptoPaymentUrl = '';
  paymentUrl = '';
  hasAcknowledgedRefundPolicy = true;

  saveOrderDataToLocalStorage = () => {
    try {
      if (productsStore.data && Object.keys(productsStore.data).length > 0) {
        const productLookup = {};
        
        if (productsStore.productsList && productsStore.productsList.length > 0) {
          productsStore.productsList.forEach(product => {
            productLookup[product.id] = {
              name: product.name,
              unitPrice: product.unitPrice,
              imageUrl: product.imageUrl,
              productClassification: product.productClassification
            };
          });
        }
        
        if (productsStore.additionalProductsList && productsStore.additionalProductsList.length > 0) {
          productsStore.additionalProductsList.forEach(product => {
            productLookup[product.id] = {
              name: product.name,
              unitPrice: product.unitPrice,
              imageUrl: product.imageUrl,
              productClassification: product.productClassification
            };
          });
        }
        
        localStorage.setItem('catalogData', JSON.stringify(productLookup));
      }
      
      if (productsStore.selectedData && productsStore.selectedData.length > 0) {
        localStorage.setItem('selectedProducts', JSON.stringify(productsStore.selectedData));
      }
      
      if (productsStore.totalPrice) {
        localStorage.setItem('totalPrice', productsStore.totalPrice.toString());
      }
      
      const pointName = productsStore.data?.pointName || 'MEAMA KIOSK';
      localStorage.setItem('pointName', pointName);
      
      console.log('Order data saved to localStorage for receipt generation');
      console.log('Product lookup created:', Object.keys(JSON.parse(localStorage.getItem('catalogData') || '{}')));
    } catch (error) {
      console.error('Error saving order data to localStorage:', error);
    }
  };

  createOrder = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('status');

    try {
      this.saveOrderDataToLocalStorage();
      
      if (productsStore.totalPrice.toNumber() === 0) {
        let res = await ApiManager.post(`create-order/${productsStore.pointId}`, 
        {
          "products": productsStore.selectedData ?? [],
          "paymentMethod": navigator.userAgent.includes("Android") ? "GOOGLE_PAY" : "APPLE_PAY",
        }, 
        {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});

        let trId = res?.data?.data.transactionId;
        let outerGeneratedId = res?.data?.data.outerGeneratedId;
        
        if (trId) {
          localStorage.setItem("transactionId", trId);
          localStorage.setItem("transactionIdForReceipt", trId);
          localStorage.setItem("qrCode", url.searchParams.get('qrCode'));
          
          componentsStore.changePage(componentsStore.pages.success);
          return;
        } else {
          const freeTransactionId = 'FREE_' + Date.now();
          localStorage.setItem("transactionId", freeTransactionId);
          localStorage.setItem("transactionIdForReceipt", freeTransactionId);
          localStorage.setItem("qrCode", url.searchParams.get('qrCode'));
          
          componentsStore.changePage(componentsStore.pages.success);
          return;
        }
      }

      let res = await ApiManager.post(`create-order/${productsStore.pointId}`, 
      {
        "products": productsStore.selectedData ?? [],
        "paymentMethod": navigator.userAgent.includes("Android") ? "GOOGLE_PAY" : "APPLE_PAY",
      }, 
      {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});

      let trId = res?.data?.data.transactionId;
      let outerGeneratedId = res?.data?.data.outerGeneratedId;
      localStorage.setItem("transactionId", trId);
      localStorage.setItem("transactionIdForReceipt", trId);
      localStorage.setItem("qrCode", url.searchParams.get('qrCode'));
      localStorage.setItem("paymentInProgress", "true"); // Flag to track payment flow

      if (res?.data?.data.checkoutURL && outerGeneratedId) {
        window.location.href = `${res?.data?.data.checkoutURL}?trans_id=${outerGeneratedId}`;
      } else {
        componentsStore.changePage(componentsStore.pages.paymentSuccess);
      }
      
    } catch (ex) {
      console.error('Error creating order:', ex);
      return false;
    } finally {}
  };

  statusInterval = async (trId) => {
    try {
      var res = await ApiManager.get(`interval/${trId}`, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
      var data = res?.data;
      var second = 0;

      this.transactionStatusInterval = setInterval(() => {
        this.transactionStatus(trId)
      }, data?.maxTimeInSeconds / data?.numberOfTries * 1000);

      this.clearTransactionStatusInterval = setInterval(() => {
        if (second === data?.maxTimeInSeconds) {
          clearInterval(this.transactionStatusInterval);
          clearInterval(this.clearTransactionStatusInterval);
          this.transactionDone("FAILED")
        }
        second++;
      }, 1000);
    } catch (ex) {
      return false;
    } finally {}
  };

  transactionStatus = async (trId) => {
    try {
      var res = await ApiManager.get(`status/${trId}`, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
      var status = res?.data?.data?.status;

      if (status !== "PENDING") {
        localStorage.removeItem("transactionId");
        this.transactionDone(status);
      }
    } catch (ex) {
      return false;
    } finally {}
  };

  createCryptoOrder = async () => {
    try {
      this.saveOrderDataToLocalStorage();
      
      if (productsStore.totalPrice.toNumber() === 0) {
        var res = await ApiManager.post(`create-crypto-order/${productsStore.pointId}`, {
          "products": productsStore.selectedData ?? []
        }, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
        
        var trId = res?.data?.data.transactionId;
        
        if (trId) {
          localStorage.setItem("transactionId", trId);
          localStorage.setItem("transactionIdForReceipt", trId);
          
          componentsStore.changePage(componentsStore.pages.success);
          return;
        } else {
          const freeTransactionId = 'FREE_' + Date.now();
          localStorage.setItem("transactionId", freeTransactionId);
          localStorage.setItem("transactionIdForReceipt", freeTransactionId);
          
          componentsStore.changePage(componentsStore.pages.success);
          return;
        }
      }

      var cryptoRes = await ApiManager.post(`create-crypto-order/${productsStore.pointId}`, {"products": productsStore.selectedData ?? []}, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
      var cryptoTrId = cryptoRes?.data?.data.transactionId;
      localStorage.setItem("transactionId", cryptoTrId);
      localStorage.setItem("transactionIdForReceipt", cryptoTrId);
  
      this.cryptoPaymentUrl = cryptoRes?.data?.data.checkoutURL;

      var second = 0;

      this.cryptoOrderInterval = setInterval(() => {
        this.cryptoTransactionStatus(cryptoTrId);
      }, 1000);

      this.clearCryptoOrderInterval = setInterval(() => {
        if (second === 190) {
          clearInterval(this.cryptoOrderInterval);
          clearInterval(this.clearCryptoOrderInterval);
          this.transactionDone("FAILED")
        }
        second++;
      }, 1000);
    } catch (ex) {
      console.error('Error creating crypto order:', ex);
      return false;
    } finally {}
  };

  cryptoTransactionStatus = async (trId) => {
    try {
      var res = await ApiManager.get(`status/${trId}`, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
      var status = res?.data?.data?.status;
      
      if (status === "PENDING") {
        componentsStore.changePage(componentsStore.pages.paymentSuccess);
      } else if (status === "COMPLETED" || status === "FAILED") {
        this.transactionDone(status);
      }
    } catch (ex) {
      return false;
    } finally {}
  };

  transactionDone (status) {
    clearInterval(this.transactionStatusInterval);
    clearInterval(this.clearTransactionStatusInterval);
    clearInterval(this.cryptoOrderInterval);
    clearInterval(this.clearCryptoOrderInterval);
    status === "COMPLETED" 
      ? componentsStore.changePage(componentsStore.pages.success)
      : componentsStore.changePage(componentsStore.pages.error)
  }

  reset () {
    // Clear any running intervals
    if (this.transactionStatusInterval) {
      clearInterval(this.transactionStatusInterval);
      this.transactionStatusInterval = null;
    }
    if (this.clearTransactionStatusInterval) {
      clearInterval(this.clearTransactionStatusInterval);
      this.clearTransactionStatusInterval = null;
    }
    if (this.cryptoOrderInterval) {
      clearInterval(this.cryptoOrderInterval);
      this.cryptoOrderInterval = null;
    }
    if (this.clearCryptoOrderInterval) {
      clearInterval(this.clearCryptoOrderInterval);
      this.clearCryptoOrderInterval = null;
    }
    
    this.paymentMethod = 'card';
    this.cryptoPaymentUrl = '';
    this.hasAcknowledgedRefundPolicy = true;
  }

  constructor() {
    makeAutoObservable(this);
  }
};

export default new PrStore();