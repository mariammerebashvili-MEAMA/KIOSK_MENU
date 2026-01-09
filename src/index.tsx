import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Box } from "./screens/Box";
import { KioskProvider } from "./contexts/KioskContext";
import { KioskModeWrapper } from "./components/KioskModeWrapper";
import { KioskFlow } from "./screens/KioskFlow/KioskFlow";
import { getKioskId, getQrCode } from "./lib/urlUtils";

// Lock screen orientation to portrait (if supported by device)
const lockOrientation = async () => {
  try {
    // Modern Screen Orientation API
    if ('orientation' in screen && 'lock' in screen.orientation) {
      await (screen.orientation as any).lock('portrait').catch((err: Error) => {
        console.log('Orientation lock not supported or failed:', err.message);
      });
    }
    
    // Legacy API fallback
    const legacyScreen = screen as any;
    if (legacyScreen.lockOrientation) {
      legacyScreen.lockOrientation('portrait');
    } else if (legacyScreen.mozLockOrientation) {
      legacyScreen.mozLockOrientation('portrait');
    } else if (legacyScreen.msLockOrientation) {
      legacyScreen.msLockOrientation('portrait');
    }
  } catch (error) {
    console.log('Orientation lock not available:', error);
  }
};

// Handle orientation changes
const handleOrientationChange = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  document.body.classList.toggle('portrait-mode', isPortrait);
  document.body.classList.toggle('landscape-mode', !isPortrait);
  
  if (!isPortrait) {
    console.warn('⚠️ Device is in landscape mode. Please rotate to portrait for optimal experience.');
  }
};

// Initialize orientation handling
window.addEventListener('load', () => {
  lockOrientation();
  handleOrientationChange();
});

window.addEventListener('orientationchange', handleOrientationChange);
window.matchMedia("(orientation: portrait)").addEventListener('change', handleOrientationChange);

// Check if running in kiosk mode (check both qrCode and legacy kiosk_id)
const isKioskMode = !!getQrCode() || !!getKioskId();

// Render React app
createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {isKioskMode ? (
      // Kiosk mode: Load catalog based on QR code from Azure API
      // Set useMockData={true} for development/testing with mock data
      <KioskProvider useMockData={false}>
        <KioskModeWrapper>
          <KioskFlow />
        </KioskModeWrapper>
      </KioskProvider>
    ) : (
      // Normal mode: Use default products (backward compatible)
      <Box />
    )}
  </StrictMode>,
);
