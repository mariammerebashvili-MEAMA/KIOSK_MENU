import { makeAutoObservable } from "mobx";

export const LocalStorageStore = class {
  currentLanguage = "en";
  
  constructor() {
    makeAutoObservable(this);
  }

  getCurrentLanguage () {
    this.currentLanguage = document.documentElement.getAttribute('lang');
    return this.currentLanguage;
  }
};

export default new LocalStorageStore();
