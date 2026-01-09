/**
 * Device Detection Usage Examples
 * This file demonstrates how to use the device detection utilities
 */

import { isIOS, isAndroid, isMobile, getDeviceType, getDeviceInfo, getAppStoreUrl } from './deviceDetection';
import useDeviceDetection from '../hooks/useDeviceDetection';

// ============================================================================
// UTILITY FUNCTION EXAMPLES
// ============================================================================

/**
 * Example 1: Basic device detection
 */
export const basicDeviceDetection = () => {
  console.log('Is iOS:', isIOS());
  console.log('Is Android:', isAndroid());
  console.log('Is Mobile:', isMobile());
  console.log('Device Type:', getDeviceType());
};

/**
 * Example 2: Get comprehensive device information
 */
export const getComprehensiveDeviceInfo = () => {
  const deviceInfo = getDeviceInfo();
  console.log('Device Info:', deviceInfo);
  
  return {
    platform: deviceInfo.deviceType,
    isMobileDevice: deviceInfo.isMobile,
    userAgent: deviceInfo.userAgent,
    platformDetails: deviceInfo.platform
  };
};

/**
 * Example 3: Conditional rendering based on device
 */
export const getDeviceSpecificContent = () => {
  if (isIOS()) {
    return {
      message: 'Welcome iOS user!',
      storeUrl: 'https://apps.apple.com/us/app/meama/id1438754087',
      features: ['Touch ID', 'Face ID', 'Apple Pay']
    };
  } else if (isAndroid()) {
    return {
      message: 'Welcome Android user!',
      storeUrl: 'https://play.google.com/store/search?q=meama&c=apps',
      features: ['Fingerprint', 'Google Pay', 'Material Design']
    };
  } else {
    return {
      message: 'Welcome desktop user!',
      storeUrl: null,
      features: ['Full keyboard', 'Mouse support', 'Large screen']
    };
  }
};

/**
 * Example 4: App store redirection
 */
export const redirectToAppStore = () => {
  const storeUrl = getAppStoreUrl();
  if (storeUrl) {
    window.open(storeUrl, '_blank');
  } else {
    console.log('No app store available for this device');
  }
};

// ============================================================================
// REACT COMPONENT EXAMPLES
// ============================================================================

/**
 * Example 5: Using the React hook in a component
 */
export const DeviceDetectionComponent = () => {
  const deviceInfo = useDeviceDetection();

  return (
    <div>
      <h3>Device Information</h3>
      <p>Platform: {deviceInfo.deviceType}</p>
      <p>Is Mobile: {deviceInfo.isMobile ? 'Yes' : 'No'}</p>
      <p>Is iOS: {deviceInfo.isIOS ? 'Yes' : 'No'}</p>
      <p>Is Android: {deviceInfo.isAndroid ? 'Yes' : 'No'}</p>
      
      {deviceInfo.isMobile && (
        <button onClick={redirectToAppStore}>
          Download App
        </button>
      )}
    </div>
  );
};

/**
 * Example 6: Conditional component rendering
 */
export const ConditionalDeviceComponent = () => {
  const { isIOS, isAndroid, isMobile } = useDeviceDetection();

  if (isIOS) {
    return <div>iOS-specific content</div>;
  }
  
  if (isAndroid) {
    return <div>Android-specific content</div>;
  }
  
  if (isMobile) {
    return <div>Generic mobile content</div>;
  }
  
  return <div>Desktop content</div>;
};

/**
 * Example 7: Device-specific styling
 */
export const DeviceSpecificStyles = () => {
  const { deviceType } = useDeviceDetection();
  
  const getDeviceStyles = () => {
    switch (deviceType) {
      case 'ios':
        return {
          backgroundColor: '#007AFF',
          borderRadius: '10px',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        };
      case 'android':
        return {
          backgroundColor: '#4CAF50',
          borderRadius: '4px',
          fontFamily: 'Roboto, sans-serif'
        };
      default:
        return {
          backgroundColor: '#6c757d',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif'
        };
    }
  };

  return (
    <div style={getDeviceStyles()}>
      Device-specific styled content
    </div>
  );
};

// ============================================================================
// INTEGRATION EXAMPLES
// ============================================================================

/**
 * Example 8: Integration with existing stores
 */
export const integrateWithStores = () => {
  // Example of how to integrate with MobX stores
  const deviceInfo = getDeviceInfo();
  
  // You could add device info to your existing stores
  // productsStore.setDeviceInfo(deviceInfo);
  // componentsStore.setDeviceType(deviceInfo.deviceType);
  
  return deviceInfo;
};

/**
 * Example 9: API integration with device info
 */
export const sendDeviceInfoToAPI = async () => {
  const deviceInfo = getDeviceInfo();
  
  // Example API call with device information
  const apiData = {
    deviceType: deviceInfo.deviceType,
    isMobile: deviceInfo.isMobile,
    platform: deviceInfo.platform,
    userAgent: deviceInfo.userAgent
  };
  
  // await ApiManager.post('/analytics/device-info', apiData);
  console.log('Device info sent to API:', apiData);
};

/**
 * Example 10: Local storage integration
 */
export const storeDeviceInfo = () => {
  const deviceInfo = getDeviceInfo();
  
  // Store device info in localStorage for future use
  localStorage.setItem('deviceInfo', JSON.stringify({
    deviceType: deviceInfo.deviceType,
    isMobile: deviceInfo.isMobile,
    timestamp: Date.now()
  }));
  
  return deviceInfo;
};

export default {
  basicDeviceDetection,
  getComprehensiveDeviceInfo,
  getDeviceSpecificContent,
  redirectToAppStore,
  DeviceDetectionComponent,
  ConditionalDeviceComponent,
  DeviceSpecificStyles,
  integrateWithStores,
  sendDeviceInfoToAPI,
  storeDeviceInfo
};
