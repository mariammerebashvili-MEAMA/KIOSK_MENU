import { makeAutoObservable } from "mobx";
import componentsStore from "./componentsStore";
import productsStore from "./productsStore";
import timeoutsStore from "./timeoutsStore";
import prStore from "../pages/Products/store";
import loaderStore from "./loaderStore";

export const ResetAllStore = class {
  resetAll () {
    componentsStore.reset();
    productsStore.reset();
    timeoutsStore.reset();
    prStore.reset();
    loaderStore.loader = false;
  }

  constructor() {
    makeAutoObservable(this);
  }
};

export default new ResetAllStore();
