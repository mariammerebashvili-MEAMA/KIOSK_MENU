import Axios from "axios";
import componentsStore from "../stores/componentsStore";

const singleton = Symbol();
const singletonEnforcer = Symbol()

export class ApiManager {
  constructor(enforcer) {
    if(enforcer !== singletonEnforcer) throw "Cannot construct singleton";
    this.session = Axios.create({
      baseURL: `https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/`
      // baseURL: `https://vendingcloudpanel.meama.ge/vms/api/mobile/kiosk/`
      // baseURL: `http://10.17.241.37:9090/vms/api/mobile/`
    });
  }

  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new ApiManager(singletonEnforcer);
    }
    return this[singleton];
  }
  
  get = async(...params) => {
    try {
      return await this.session.get(...params);
    } catch (ex) {
      this.parseResponse(ex);
      throw ex;
    }
  }
  post = async(...params) => {
    try {
      return await this.session.post(...params);
    } catch (ex){
      this.parseResponse(ex);
      throw ex;
    }
  }
  put = (...params) => this.session.put(...params);
  patch = (...params) => this.session.patch(...params);
  remove = (...params) => this.session.delete(...params);

  parseResponse (resp) { 
    if (resp.response.data !== undefined) {
      if (resp.response.data.errorCode && resp.response.data.errorCode === "DEVICE_BUSY") {
        componentsStore.changePage(componentsStore.pages.busy);
        return;
      } 
    }
    componentsStore.changePage(componentsStore.pages.error);
  }
}

export default ApiManager.instance