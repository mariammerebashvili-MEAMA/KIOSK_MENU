import { useState, useEffect } from 'react';
import { getDeviceInfo } from '../utils/deviceDetection';

/**
 * React hook for device detection
 * @returns {object} Device detection information
 */
const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => getDeviceInfo());

  useEffect(() => {
    // Update device info on mount and when window is resized
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo());
    };

    // Initial check
    updateDeviceInfo();

    // Listen for orientation changes and resize events
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
