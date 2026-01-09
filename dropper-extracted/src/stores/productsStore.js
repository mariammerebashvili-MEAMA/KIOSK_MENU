import { makeAutoObservable } from "mobx";
import sumBy from 'lodash/sumBy';
import ApiManager from "../ApiManager/APIManager";
import localStorageStore from "./localStorageStore";
import Decimal from 'decimal.js';

export const ProductsStore = class {
  categoryTypeEnums = {
    capsule: "CAPSULE",
    additionalProduct: "ADDITIONAL_PRODUCT"
  }

  productClassificationEnums = {
    americanCapsule: "AMERICAN_CAPSULE",
    europeanCapsule: "EUROPEAN_CAPSULE",
    americanCup: "AMERICAN_CUP",
    europeanCup: "EUROPEAN_CUP",
    sugar: "SUGAR",
  }

  qrCode = null;
  pointId = 0;
  data = [];
  selectedData = [];
  productsData = [];
  additionalProductsData = [];
  productsList = [];
  additionalProductsList = [];
  maxPurchaseQuantity = 0;
  purchasePerCapsuleQuantity = 0;
  totalSelectedProductQty = 0;
  totalPrice = new Decimal(0);
  catalogLoader = true;

  getQRCode () {
    // Try to get qrCode from URL first
    const params = new URLSearchParams(window.location.search);
    let qr = params.get('qrCode') || params.get('QrCode');

    // If missing, try to recover from localStorage and inject into URL immediately
    if (!qr) {
      const storedQr = localStorage.getItem('qrCode');
      if (storedQr) {
        params.set('qrCode', storedQr);
        // Do not remove from localStorage here; backend may still need it during flow
        const search = params.toString();
        const url = `${window.location.pathname}?${search}`;
        window.history.replaceState(null, null, url);
        qr = storedQr;
      }
    }

    this.qrCode = qr;
    return this.qrCode;
  }

  getAllProducts = async () => {
    this.catalogLoader = true;
    try {
      if (this.data.length > 0) return this.data;
      let params = new URLSearchParams(window.location.search);
      if (params.get('status') && localStorage.getItem("transactionId")) return;
      
      // Ensure qrCode exists; if missing, try to recover it using transactionId endpoint
      let qrForCatalog = this.getQRCode();
      if (!qrForCatalog) {
        try {
          const txId = localStorage.getItem('transactionId') || params.get('trans_id');
          if (txId) {
            const apiBase = ApiManager.session?.defaults?.baseURL || '';
            const baseOrigin = (() => {
              try { return new URL(apiBase).origin; } catch { return ''; }
            })();
            const absoluteUrl = `${baseOrigin}/api/kioskDevice/transactions/transaction/${encodeURIComponent(txId)}`;
            const txResp = await ApiManager.get(absoluteUrl, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
            const fetchedQr = txResp?.data?.qrCode || txResp?.data?.data?.qrCode;
            const fetchedPointId = txResp?.data?.pointId || txResp?.data?.data?.pointId;
            if (fetchedQr) {
              const p = new URLSearchParams(window.location.search);
              p.set('qrCode', fetchedQr);
              const search = p.toString();
              const url = `${window.location.pathname}?${search}`;
              window.history.replaceState(null, null, url);
              this.qrCode = fetchedQr;
              qrForCatalog = fetchedQr;
            }
            if (fetchedPointId) {
              this.pointId = fetchedPointId;
            }
          }
        } catch (e) {
          // If fetching by transactionId fails, proceed without changing flow; API call may still fail and be handled upstream
        }
      }

      var res = await ApiManager.get(`catalog/${qrForCatalog || this.getQRCode()}`, {headers: {'Content-Language': localStorageStore.getCurrentLanguage()}});
      this.data = res.data.data;

      this.pointId = this.data.pointId;
      this.productsData = this.data?.catalogPages?.filter(o => o?.categoryType === this.categoryTypeEnums?.capsule)[0] ?? [];
      this.additionalProductsData = this.data?.catalogPages?.filter(o => o?.categoryType === this.categoryTypeEnums?.additionalProduct)[0] ?? [];
      this.productsList = this.productsData?.products ?? [];
      this.additionalProductsList = this.additionalProductsData?.products ?? [];
      this.maxPurchaseQuantity = this.productsData?.maxPurchaseQuantity ?? 0;
      this.purchasePerCapsuleQuantity = this.productsData?.purchasePerCapsuleQuantity ?? 0;
      this.start();
      
      return this.data;
    } catch (ex) {
      return false;
    } finally {
      this.catalogLoader = false;
    }
  };

  productQty (categoryType, productId, diff) {
    let product = this.getCurrentProduct(categoryType, productId);

    
    if (categoryType === this.categoryTypeEnums?.capsule) {
      if (diff === 1) {
        if (
          product.selectedQty < product.availableQuantity && 
          product.selectedQty < this.maxPurchaseQuantity &&
          product.selectedQty < this.purchasePerCapsuleQuantity &&
          this.maxPurchaseQuantity > this.totalSelectedProductQty
        ) {
          product.selectedQty += diff;
          this.totalSelectedProductQty += diff;
          this.enableOrDisableProductInc();
        }
      } else {
        if (product.selectedQty !== 0) {
          product.selectedQty += diff;
          this.totalSelectedProductQty += diff;
          this.enableOrDisableProductInc();
        }
      }
    }

    if (categoryType === this.categoryTypeEnums?.additionalProduct) {
      if (diff === 1) {
        if (product.selectedQty < product.availableQuantity && product.selectedQty < product.maxSelectableQty) {
          product.selectedQty += diff;
        }  
      }
      else {
        if (product.selectedQty !== 0) {
          product.selectedQty += diff;
        }
      }
    }

    if (this.additionalProductsList.length) {
      this.setAdditionalProductsQty(
        this.getProductsQtyByClassification().amCapsulesQty,
        this.getProductsQtyByClassification().euCapsulesQty,
      );
      this.enableOrDisableAdditionalProductInc();
    }

    this.addSelectedProducts();
    this.calcTotalPrice();
  }

  calcTotalPrice () {
    const productsSum = this.productsList.filter(o => o.selectedQty > 0).reduce((accumulator, o) => {
      return new Decimal(accumulator).plus(new Decimal(o.unitPrice).mul(o.selectedQty).toNumber()).toNumber()
    }, 0);

    const additionalProductsSum = this.additionalProductsList.filter(o => o.selectedQty > 0).reduce((accumulator, o) => {
      return new Decimal(accumulator).plus(new Decimal(o.unitPrice).mul(o.selectedQty).toNumber()).toNumber()
    }, 0);

          this.totalPrice = new Decimal(productsSum).plus(additionalProductsSum)
  }

  addSelectedProducts () {
    this.selectedData = [];
    
    this.productsList.filter(o => o.selectedQty > 0).reduce((accumulator, o) => {
      return this.selectedData.push({id: o.id, quantity: o.selectedQty});
    }, 0);

    this.additionalProductsList.filter(o => o.selectedQty > 0).reduce((accumulator, o) => {
      return this.selectedData.push({id: o.id, quantity: o.selectedQty});
    }, 0);
  }

  enableOrDisableProductInc () {
    this.productsList.map(o => {
      if (
        o.selectedQty >= this.maxPurchaseQuantity ||
        o.selectedQty >= this.purchasePerCapsuleQuantity ||
        o.selectedQty >= o.availableQuantity ||
        this.totalSelectedProductQty >= this.maxPurchaseQuantity
      ) o.disableInc = true;
      else o.disableInc = false;
    })
  }

  enableOrDisableAdditionalProductInc () {
    this.additionalProductsList.map(o => {
      if (o.selectedQty >= o.maxSelectableQty || o.selectedQty >= o.availableQuantity) o.disableInc = true;
      else o.disableInc = false;
    });
  }

  getProductsQtyByClassification () {
    let amCapsulesQty = sumBy(this.productsList.filter(o => o?.productClassification === this.productClassificationEnums?.americanCapsule), function (o) { return o.selectedQty ?? 0 });
    let euCapsulesQty = sumBy(this.productsList.filter(o => o?.productClassification === this.productClassificationEnums?.europeanCapsule), function (o) { return o.selectedQty ?? 0 });
    
    return {amCapsulesQty, euCapsulesQty}
  }

  setAdditionalProductsQty (amCapsulesQty, euCapsulesQty) {
    let amCupItem = this.additionalProductsList.filter(o => o.productClassification === this.productClassificationEnums?.americanCup)[0] ?? [];
    let euCupItem = this.additionalProductsList.filter(o => o.productClassification === this.productClassificationEnums?.europeanCup)[0] ?? [];
    let sugarItem = this.additionalProductsList.filter(o => o.productClassification === this.productClassificationEnums?.sugar)[0] ?? [];

    if (amCapsulesQty * amCupItem.perCapsuleQuantity <= amCupItem.availableQuantity)
      amCupItem.maxSelectableQty = amCapsulesQty * amCupItem.perCapsuleQuantity;
    else if (amCupItem.selectedQty <= amCupItem.availableQuantity)
      amCupItem.maxSelectableQty = amCupItem.availableQuantity;

    if (euCapsulesQty * euCupItem.perCapsuleQuantity <= euCupItem.availableQuantity)
      euCupItem.maxSelectableQty = euCapsulesQty * euCupItem.perCapsuleQuantity;
    else if (euCupItem.selectedQty <= euCupItem.availableQuantity)
      euCupItem.maxSelectableQty = euCupItem.availableQuantity;

    if (this.totalSelectedProductQty * sugarItem.perCapsuleQuantity <= sugarItem.availableQuantity) 
      sugarItem.maxSelectableQty = this.totalSelectedProductQty * sugarItem.perCapsuleQuantity;
    else if (sugarItem.selectedQty <= sugarItem.availableQuantity)
      sugarItem.maxSelectableQty = sugarItem.availableQuantity;

    if (amCupItem.selectedQty > amCupItem.maxSelectableQty) amCupItem.selectedQty = amCupItem.maxSelectableQty;
    if (euCupItem.selectedQty > euCupItem.maxSelectableQty) euCupItem.selectedQty = euCupItem.maxSelectableQty;
    if (sugarItem.selectedQty > sugarItem.maxSelectableQty) sugarItem.selectedQty = sugarItem.maxSelectableQty;
  }

  getCurrentProduct (categoryType, productId) {
    let productItem;

    switch (categoryType) {
      case this.categoryTypeEnums?.capsule:
        productItem = this.productsList?.filter(o => o?.id === productId)[0];
        break;
      case this.categoryTypeEnums?.additionalProduct:
        productItem = this.additionalProductsList?.filter(o => o?.id === productId)[0];
        break;
      default:
        break;
    }

    return productItem;
  }

  incProductQty (categoryType, productId) { this.productQty(categoryType, productId, +1) }
  decProductQty (categoryType, productId) { this.productQty(categoryType, productId, -1) }

  start () {
    this.productsList.map(o => {
      o.selectedQty = 0;
      o.disableInc = false;
      o.outOfStock = !o.availableQuantity;
    });

    this.additionalProductsList.map(o => {
      o.selectedQty = 0;
      o.disableInc = true;
      o.outOfStock = !o.availableQuantity;
      o.maxSelectableQty = 0;
    });
  }

  reset () {
    this.start();

    this.qrCode = null;
    this.pointId = 0;
    this.data = [];
    this.selectedData = [];
    this.productsData = [];
    this.additionalProductsData = [];
    this.productsList = [];
    this.additionalProductsList = [];
    this.maxPurchaseQuantity =  0;
    this.purchasePerCapsuleQuantity = 0;
    this.totalSelectedProductQty = 0;
    this.totalPrice = new Decimal(0);
    this.catalogLoader = true;
  }
  
  constructor() {
    makeAutoObservable(this);
  }
};

export default new ProductsStore();
