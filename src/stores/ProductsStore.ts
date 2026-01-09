import { makeAutoObservable } from 'mobx';
import { Product } from '../lib/kioskApi';

/**
 * MobX Store for managing products catalog
 */
export class ProductsStore {
  products: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  qrCode: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProducts(products: Product[]) {
    this.products = products;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setQrCode(qrCode: string | null) {
    this.qrCode = qrCode;
    // Store in localStorage for persistence
    if (qrCode) {
      localStorage.setItem('kioskQrCode', qrCode);
    }
  }

  getQrCodeFromStorage(): string | null {
    return localStorage.getItem('kioskQrCode');
  }

  clearProducts() {
    this.products = [];
    this.error = null;
  }

  reset() {
    this.products = [];
    this.isLoading = false;
    this.error = null;
    this.qrCode = null;
  }

  // Get product by ID
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Get products by capsule type
  getProductsByCapsuleType(capsuleType: 'european' | 'american'): Product[] {
    return this.products.filter(p => p.capsuleType === capsuleType);
  }
}

// Singleton instance
export const productsStore = new ProductsStore();

