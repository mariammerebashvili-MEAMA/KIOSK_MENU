import { makeAutoObservable } from "mobx";
import Products from "../pages/Products";
import CryptoPayment from "../pages/CryptoPayment";
import PaymentSuccess from "../pages/PaymentSuccess";
import Receipt from "../pages/Receipt";
import Success from "../pages/Success";
import Done from "../pages/Done";
import Error from "../pages/Error";
import Busy from "../pages/Busy";

export const ComponentsStore = class {
  busy = false;

  pages = {
    products: <Products key="products" />,
    cryptoPayment: <CryptoPayment key="cryptoPayment" />,
    paymentSuccess: <PaymentSuccess key="paymentSuccess" />,
    receipt: <Receipt key="receipt" />,
    success: <Success key="success" />,
    done: <Done key="done" />,
    error: <Error key="error" />,
    busy: <Busy key="busy" />,
  }

  currentComponent = this.pages.products;

  changePage(page) {
    this.currentComponent = page;

    this.busy = true;
    setTimeout(() => this.busy = false, 500);
  }

  reset () {
    this.changePage(this.pages.products);
  }

  constructor() {
    makeAutoObservable(this);
  }
};

export default new ComponentsStore();
