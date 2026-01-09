/**
 * Device Detection Utility
 * Provides functions to detect iOS and Android devices
 */

/**
 * Detects if the user is on an iOS device
 * @returns {boolean} True if the device is iOS
 */
export const isIOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for iOS devices
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
};

/**
 * Detects if the user is on an Android device
 * @returns {boolean} True if the device is Android
 */
export const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for Android devices
  return /Android/.test(userAgent);
};

/**
 * Detects if the user is on a mobile device (iOS or Android)
 * @returns {boolean} True if the device is mobile
 */
export const isMobile = () => {
  return isIOS() || isAndroid();
};

/**
 * Gets the device type as a string
 * @returns {string} 'ios', 'android', or 'desktop'
 */
export const getDeviceType = () => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'desktop';
};

/**
 * Gets detailed device information
 * @returns {object} Object containing device information
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
    deviceType: getDeviceType(),
    userAgent: userAgent,
    platform: navigator.platform || 'unknown'
  };
};

/**
 * Gets the appropriate app store URL based on device
 * @returns {string} App store URL for the current device
 */
export const getAppStoreUrl = () => {
  if (isIOS()) {
    return 'https://apps.apple.com/us/app/meama/id1438754087';
  } else if (isAndroid()) {
    return 'https://play.google.com/store/search?q=meama&c=apps';
  }
  return null;
};

export default {
  isIOS,
  isAndroid,
  isMobile,
  getDeviceType,
  getDeviceInfo,
  getAppStoreUrl
};
