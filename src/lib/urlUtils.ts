/**
 * Parse URL query parameters
 */
export const getQueryParam = (param: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * Get kiosk_id from URL query parameters (legacy support)
 */
export const getKioskId = (): string | null => {
  return getQueryParam('kiosk_id');
};

/**
 * Get qrCode from URL query parameters or localStorage fallback
 */
export const getQrCode = (): string | null => {
  // First try URL parameter (support both qrCode and legacy QrCode casing)
  const urlQrCode = getQueryParam('qrCode') || getQueryParam('QrCode');
  if (urlQrCode) return urlQrCode;

  // Dropper legacy fallback key
  const legacyStoredQr = localStorage.getItem('qrCode');
  if (legacyStoredQr) {
    // Inject into URL for consistency (mirrors Dropper behavior)
    const params = new URLSearchParams(window.location.search);
    params.set('qrCode', legacyStoredQr);
    const search = params.toString();
    const url = `${window.location.pathname}?${search}`;
    window.history.replaceState(null, '', url);

    // Also persist under our current key
    localStorage.setItem('kioskQrCode', legacyStoredQr);
    return legacyStoredQr;
  }

  // Current fallback key
  return localStorage.getItem('kioskQrCode');
};

/**
 * Validate kiosk_id format (basic validation)
 * Add more specific validation rules as needed
 */
export const isValidKioskId = (kioskId: string | null): boolean => {
  if (!kioskId) return false;
  
  // Basic validation: non-empty string with reasonable length
  const trimmed = kioskId.trim();
  return trimmed.length > 0 && trimmed.length <= 50;
};

/**
 * Validate qrCode format
 */
export const isValidQrCode = (qrCode: string | null): boolean => {
  if (!qrCode) return false;
  
  // Basic validation: non-empty string with reasonable length
  const trimmed = qrCode.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
};

