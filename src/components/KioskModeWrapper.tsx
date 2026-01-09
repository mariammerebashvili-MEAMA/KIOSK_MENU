import { ReactNode } from 'react';
import { useKiosk } from '../contexts/KioskContext';
import { KioskErrorState } from './KioskErrorState';
import { KioskLoadingState } from './KioskLoadingState';

interface KioskModeWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that handles kiosk mode state
 * Shows loading, error, or children based on kiosk state
 */
export const KioskModeWrapper = ({ children }: KioskModeWrapperProps) => {
  const { isLoading, error, catalog, refetch } = useKiosk();

  // Show loading state
  if (isLoading) {
    return <KioskLoadingState />;
  }

  // Show error state if there's an error
  if (error) {
    // Determine error type and appropriate message
    const isInvalidQrCode = error.includes('Invalid or missing qrCode') || error.includes('Invalid or missing kiosk_id');
    const isNotFound = error.includes('not found') || error.includes('404');
    const isNetworkError = error.includes('Network error') || error.includes('connection');
    
    return (
      <KioskErrorState
        title={
          isInvalidQrCode ? 'QR Code Required' :
          isNotFound ? 'Kiosk Not Found' :
          isNetworkError ? 'Connection Error' :
          'Error Loading Catalog'
        }
        message={
          isInvalidQrCode
            ? 'Please scan a valid QR code to access the kiosk menu.'
            : isNotFound
            ? 'This kiosk is not recognized. Please scan the QR code again or contact support.'
            : isNetworkError
            ? 'Unable to connect to the server. Please check your internet connection and try again.'
            : `${error}. Please try again or contact support if the problem persists.`
        }
        onRetry={refetch}
        showRetry={!isInvalidQrCode}
      />
    );
  }

  // Show error if catalog is empty
  if (!catalog || !catalog.products || catalog.products.length === 0) {
    return (
      <KioskErrorState
        title="No Products Available"
        message="This kiosk has no products configured. Please contact support."
        onRetry={refetch}
        showRetry={true}
      />
    );
  }

  // Render children (the actual kiosk UI) when everything is loaded
  return <>{children}</>;
};

