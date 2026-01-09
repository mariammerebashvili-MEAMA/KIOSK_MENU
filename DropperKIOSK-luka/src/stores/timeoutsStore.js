import { makeAutoObservable } from "mobx";
import resetAllStore from "./resetAllStore";
import loaderStore from "./loaderStore";

export const TimeoutsStore = class {
  data = [];
  stPagesTimeout = 0;
  receiptPageTimeout = 0;
  twoMinuteTimeout = 0;

  statusPagesTimeout () { this.stPagesTimeout = setTimeout(() => resetAllStore.resetAll(), 10000) }
  clearStPagesTimeout () { clearTimeout(this.stPagesTimeout) }
  
  startReceiptPageTimeout () { this.receiptPageTimeout = setTimeout(() => resetAllStore.resetAll(), 60000) }
  clearReceiptPageTimeout () { clearTimeout(this.receiptPageTimeout) }

  startTwoMinuteTimeout () { this.twoMinuteTimeout = setTimeout(() => resetAllStore.resetAll(), 120000) }
  clearTwoMinuteTimeout () { clearTimeout(this.twoMinuteTimeout) }

  resetReceiptPageTimeouts () {
    this.clearReceiptPageTimeout();
    this.startReceiptPageTimeout();
  }

  reset () {
    setTimeout(() => {
      this.clearStPagesTimeout();
      this.clearReceiptPageTimeout();
      this.clearTwoMinuteTimeout();

      this.data = [];
      this.stPagesTimeout = 0;
      this.receiptPageTimeout = 0;
      this.twoMinuteTimeout = 0;
  
      loaderStore.loader = false;
    }, 250);
  }

  constructor() {
    makeAutoObservable(this);
  }
};

export default new TimeoutsStore();
