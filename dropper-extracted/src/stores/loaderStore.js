import { makeAutoObservable } from "mobx";

export const LoaderStore = class {
  loader = false;  

  constructor() {
    makeAutoObservable(this);
  }
};

export default new LoaderStore();
