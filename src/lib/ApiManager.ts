import axios, { AxiosInstance, AxiosError } from 'axios';
import { KioskCatalog } from './kioskApi';

/**
 * API Manager Singleton for handling all API calls
 */
class ApiManager {
  private static instance: ApiManager;
  private axiosInstance: AxiosInstance;
  
  // Azure API base URL
  private readonly BASE_URL = 'https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk';

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 15000, // 15 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.status);
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ Response Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ApiManager {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  /**
   * Fetch catalog by QR code
   * GET /catalog-with-variants/{qrCode}
   */
  async fetchCatalog(qrCode: string): Promise<KioskCatalog> {
    try {
      console.log('🔍 Attempting to fetch catalog for QR code:', qrCode);
      console.log('🔍 Full URL will be:', `${this.BASE_URL}/catalog-with-variants/${qrCode}`);
      
      const response = await this.axiosInstance.get<any>(`/catalog-with-variants/${qrCode}`);
      
      console.log('📦 Raw API Response:', response.data);
      console.log('📦 Response Type:', typeof response.data);
      console.log('📦 Response Keys:', response.data ? Object.keys(response.data) : 'null');
      
      if (!response.data) {
        throw new Error('Empty response from server');
      }

      // Check if response is an array (some APIs return array directly)
      let catalogData: KioskCatalog;
      
      if (Array.isArray(response.data)) {
        // API returns array directly
        console.log('✅ API returned products array directly');
        catalogData = {
          kioskId: qrCode,
          products: response.data,
        };
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        // API returns object with products property
        console.log('✅ API returned catalog object with products array');
        catalogData = response.data;
      } else if (response.data?.data?.catalogPages && Array.isArray(response.data.data.catalogPages)) {
        // Dropper legacy structure: { data: { pointId, pointName, catalogPages: [...] } }
        console.log('✅ API returned Dropper-style catalogPages');
        const root = response.data.data;
        const capsulePage = root.catalogPages.find((p: any) => p?.categoryType === 'CAPSULE');
        const additionalPage = root.catalogPages.find((p: any) => p?.categoryType === 'ADDITIONAL_PRODUCT');

        catalogData = {
          kioskId: qrCode,
          products: Array.isArray(capsulePage?.products) ? capsulePage.products : [],
          additionalProducts: Array.isArray(additionalPage?.products) ? additionalPage.products : [],
          maxPurchaseQuantity: capsulePage?.maxPurchaseQuantity ?? 0,
          purchasePerCapsuleQuantity: capsulePage?.purchasePerCapsuleQuantity ?? 0,
          pointId: root?.pointId ?? 0,
          pointName: root?.pointName ?? undefined,
        };
      } else {
        // Unexpected structure - log and throw error
        console.error('❌ Unexpected API response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Invalid catalog structure: products array missing');
      }

      if (catalogData.products.length === 0) {
        throw new Error('No products available for this kiosk');
      }

      console.log('✅ Parsed catalog:', catalogData.products.length, 'products');
      return catalogData;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Log the actual error response
          console.error('❌ Error Response Status:', error.response.status);
          console.error('❌ Error Response Data:', error.response.data);
          
          // Server responded with error status
          const errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data?.message || error.response.statusText;
            
          switch (error.response.status) {
            case 404:
              throw new Error(`Kiosk not found: ${errorMessage}`);
            case 400:
              throw new Error(`Invalid QR code: ${errorMessage}`);
            case 500:
              throw new Error(`Server error: ${errorMessage}`);
            default:
              throw new Error(`API Error (${error.response.status}): ${errorMessage}`);
          }
        } else if (error.request) {
          // Request made but no response
          console.error('❌ No response received from server');
          throw new Error('Network error. Please check your connection.');
        }
      }
      
      // Generic error
      console.error('❌ Generic error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch catalog');
    }
  }

  /**
   * Generic GET (used by Dropper-compat logic like transaction lookups).
   */
  async get<T = any>(url: string, config?: any): Promise<T> {
    const resp = await this.axiosInstance.get(url, config);
    return resp.data as T;
  }

  /**
   * Generic POST (used for order creation flows).
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const resp = await this.axiosInstance.post(url, data, config);
    return resp.data as T;
  }

  /**
   * Get the base URL (for debugging/testing)
   */
  getBaseUrl(): string {
    return this.BASE_URL;
  }
}

// Export singleton instance
export const apiManager = ApiManager.getInstance();
export default ApiManager;

