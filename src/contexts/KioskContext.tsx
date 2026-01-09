import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getKioskId, isValidKioskId, getQrCode, isValidQrCode } from '../lib/urlUtils';
import { fetchMockKioskCatalog, fetchKioskCatalog, KioskCatalog, Product } from '../lib/kioskApi';
import { productsStore } from '../stores/ProductsStore';
import { kioskSelectionStore } from '../stores/KioskSelectionStore';

interface KioskContextType {
  kioskId: string | null;
  qrCode: string | null;
  catalog: KioskCatalog | null;
  products: Product[];
  additionalProducts: Product[];
  isLoading: boolean;
  error: string | null;
  isKioskMode: boolean;
  refetch: () => Promise<void>;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

interface KioskProviderProps {
  children: ReactNode;
  useMockData?: boolean; // Set to false when backend is ready
}

export const KioskProvider = ({ 
  children, 
  useMockData = false // Default to real API (set to true for mock data)
}: KioskProviderProps) => {
  const [kioskId, setKioskId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<KioskCatalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = async (code: string) => {
    setIsLoading(true);
    setError(null);
    productsStore.setLoading(true);
    productsStore.setError(null);

    try {
      // Use mock data or real API based on configuration
      let catalogData: KioskCatalog;
      
      if (useMockData) {
        console.log('📦 Using mock data for QR code:', code);
        catalogData = await fetchMockKioskCatalog(code);
      } else {
        console.log('🌐 Fetching real catalog from Azure API for QR code:', code);
        catalogData = await fetchKioskCatalog(code);
      }

      // Update MobX store
      productsStore.setProducts(catalogData.products);
      productsStore.setQrCode(code);

      // Initialize Dropper-compatible selection store (if additional products/constraints exist)
      kioskSelectionStore.loadFromCatalog(catalogData, code);
      
      setCatalog(catalogData);
      console.log('✅ Catalog loaded successfully:', catalogData.products.length, 'products');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load catalog';
      console.error('❌ Catalog fetch error:', errorMessage);
      setError(errorMessage);
      productsStore.setError(errorMessage);
      setCatalog(null);
      kioskSelectionStore.reset();
    } finally {
      setIsLoading(false);
      productsStore.setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get QR code from URL or localStorage
    const code = getQrCode();
    
    // Fallback to old kiosk_id parameter for backward compatibility
    const legacyId = getKioskId();
    const finalCode = code || legacyId;
    
    if (!finalCode || (!isValidQrCode(finalCode) && !isValidKioskId(finalCode))) {
      setError('Invalid or missing qrCode parameter. Please scan the QR code.');
      setQrCode(null);
      setKioskId(null);
      setCatalog(null);
      setIsLoading(false);
      productsStore.setLoading(false);
      productsStore.setError('Invalid or missing qrCode parameter');
      return;
    }

    setQrCode(finalCode);
    setKioskId(finalCode); // Keep for backward compatibility
    fetchCatalog(finalCode);
  }, []); // Only run once on mount

  const refetch = async () => {
    const code = qrCode || kioskId;
    if (code) {
      await fetchCatalog(code);
    }
  };

  const value: KioskContextType = {
    kioskId,
    qrCode,
    catalog,
    products: productsStore.products.length > 0 ? productsStore.products : (catalog?.products || []),
    additionalProducts: catalog?.additionalProducts || [],
    isLoading,
    error,
    isKioskMode: !!qrCode || !!kioskId,
    refetch,
  };

  return (
    <KioskContext.Provider value={value}>
      {children}
    </KioskContext.Provider>
  );
};

/**
 * Hook to access kiosk context
 */
export const useKiosk = (): KioskContextType => {
  const context = useContext(KioskContext);
  
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  
  return context;
};

