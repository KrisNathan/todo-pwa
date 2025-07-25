import { useState, useEffect } from 'react';

// Type definitions for experimental web APIs
interface NetworkInformation {
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>;
}

export const useBatterySaver = () => {
  const [isBatterySaverMode, setIsBatterySaverMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkBatterySaver = async () => {
      let batterySaverDetected = false;

      // 1. Check if user prefers reduced motion (most reliable indicator)
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        batterySaverDetected = true;
      }

      // 2. Check if data saver is enabled
      if ('connection' in navigator && (navigator as NavigatorWithConnection).connection?.saveData) {
        batterySaverDetected = true;
      }

      // 3. Check battery level if available
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as NavigatorWithBattery).getBattery();
          const isLowBattery = battery.level < 0.15; // Less than 15%
          const isNotCharging = !battery.charging;
          
          if (isLowBattery && isNotCharging) {
            batterySaverDetected = true;
          }

          // Listen for battery changes
          const handleBatteryChange = () => {
            const newIsLowBattery = battery.level < 0.15;
            const newIsNotCharging = !battery.charging;
            const newState = prefersReducedMotion || 
                           ('connection' in navigator && (navigator as NavigatorWithConnection).connection?.saveData) ||
                           (newIsLowBattery && newIsNotCharging);
            setIsBatterySaverMode(newState);
          };

          battery.addEventListener('levelchange', handleBatteryChange);
          battery.addEventListener('chargingchange', handleBatteryChange);

          // Cleanup listeners
          return () => {
            battery.removeEventListener('levelchange', handleBatteryChange);
            battery.removeEventListener('chargingchange', handleBatteryChange);
          };
        } catch (error) {
          console.warn('Battery API not available:', error);
        }
      }

      setIsBatterySaverMode(batterySaverDetected);
      setIsLoading(false);
    };

    checkBatterySaver();

    // Listen for changes to reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsBatterySaverMode(prev => e.matches || prev);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return { isBatterySaverMode, isLoading };
};
