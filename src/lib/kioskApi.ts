/**
 * Product types for the kiosk catalog
 */
export type CapsuleType = "european" | "american";

export interface Product {
  id: number;
  name: string;
  type: string;
  price: string;
  image: string;
  capsuleType: CapsuleType;

  /**
   * Dropper (legacy) fields - optional so existing UI keeps working.
   */
  media?: Array<{ url?: string }>;
  unitPrice?: number;
  imageUrl?: string;
  availableQuantity?: number;
  productClassification?:
    | "AMERICAN_CAPSULE"
    | "EUROPEAN_CAPSULE"
    | "AMERICAN_CUP"
    | "EUROPEAN_CUP"
    | "SUGAR"
    | string;
  perCapsuleQuantity?: number; // for additional products
}

export interface KioskCatalog {
  kioskId: string;
  products: Product[];
  /**
   * Dropper-style catalogs include additional products and constraints.
   */
  additionalProducts?: Product[];
  maxPurchaseQuantity?: number;
  purchasePerCapsuleQuantity?: number;
  pointId?: number;
  pointName?: string;
  kioskName?: string;
  location?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

/**
 * Fetch catalog for a specific kiosk using QR code
 * Uses the Azure API endpoint
 */
export const fetchKioskCatalog = async (
  qrCode: string
): Promise<KioskCatalog> => {
  try {
    // Import API Manager dynamically to avoid circular dependencies
    const { apiManager } = await import('./ApiManager');
    const catalog = await apiManager.fetchCatalog(qrCode);
    return catalog;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch catalog');
  }
};

/**
 * Mock catalog fetcher for development/testing
 * Remove this when backend API is ready
 */
export const fetchMockKioskCatalog = async (
  kioskId: string
): Promise<KioskCatalog> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate different catalogs based on kiosk_id
  const catalogs: Record<string, KioskCatalog> = {
    QR123456: {
      kioskId: 'QR123456',
      kioskName: 'Main Lobby Kiosk',
      location: 'Building A - Floor 1',
      products: [
        {
          id: 1,
          name: "Berry Hibiscus",
          type: "Black Tea",
          price: "2.25₾",
          image: "/lead-09-20--20copy-1638346565438-png.png",
          capsuleType: "european",
        },
        {
          id: 2,
          name: "Green Tea Mint",
          type: "Green Tea",
          price: "2.25₾",
          image: "/lead-09-20--20copy-1638346565438-png-1.png",
          capsuleType: "european",
        },
      ],
    },
    QR789012: {
      kioskId: 'QR789012',
      kioskName: 'Coffee Corner Kiosk',
      location: 'Building B - Floor 3',
      products: [
        {
          id: 3,
          name: "American Coffee",
          type: "Coffee",
          price: "2.50₾",
          image: "/lead-09-20--20copy-1638346565438-png-2.png",
          capsuleType: "american",
        },
        {
          id: 4,
          name: "Espresso Bold",
          type: "Coffee",
          price: "2.50₾",
          image: "/lead-09-20--20copy-1638346565438-png-3.png",
          capsuleType: "american",
        },
      ],
    },
    FULL_CATALOG: {
      kioskId: 'FULL_CATALOG',
      kioskName: 'Premium Kiosk',
      location: 'VIP Lounge',
      products: [
        {
          id: 1,
          name: "Berry Hibiscus",
          type: "Black Tea",
          price: "2.25₾",
          image: "/lead-09-20--20copy-1638346565438-png.png",
          capsuleType: "european",
        },
        {
          id: 2,
          name: "Green Tea Mint",
          type: "Green Tea",
          price: "2.25₾",
          image: "/lead-09-20--20copy-1638346565438-png-1.png",
          capsuleType: "european",
        },
        {
          id: 3,
          name: "American Coffee",
          type: "Coffee",
          price: "2.50₾",
          image: "/lead-09-20--20copy-1638346565438-png-2.png",
          capsuleType: "american",
        },
        {
          id: 4,
          name: "Espresso Bold",
          type: "Coffee",
          price: "2.50₾",
          image: "/lead-09-20--20copy-1638346565438-png-3.png",
          capsuleType: "american",
        },
      ],
    },
  };

  const catalog = catalogs[kioskId];
  
  if (!catalog) {
    throw new Error('Kiosk not found');
  }

  return catalog;
};

