import { useEffect } from "react";
import useInstallStore, { type BeforeInstallPromptEvent } from "../stores/installStore";

interface InstallContextProps {
  children: React.ReactNode;
};

export default function InstallContext({ children }: InstallContextProps) {
  const { setIsInstalled, setDeferredPrompt } = useInstallStore();

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      // Method 1: Check display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      // Method 2: Check if running in PWA mode (iOS Safari)
      const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

      // Method 3: Check for Android TWA
      const isAndroidTWA = document.referrer.includes('android-app://');

      setIsInstalled(isStandalone || isIOSStandalone || isAndroidTWA);
      console.log(`PWA installed: ${isStandalone || isIOSStandalone || isAndroidTWA}`);
    };

    checkInstallation();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);


  return children;
}