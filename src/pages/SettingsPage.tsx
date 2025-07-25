import { useState, useEffect } from "react";
import Switch from "../components/Switch";
import CodeBox from "../components/textbox/CodeBox";
import Button from "../components/Button";
import { MdDarkMode, MdHdrAuto, MdLightMode } from "react-icons/md";

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function SettingsPage() {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncCode, setSyncCode] = useState("your-sync-code-here");
  const [deviceName, setDeviceName] = useState("My Device");

  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 select-none">
      <div>WORK IN PROGRESS</div>

      <h1 className="typography-large">Install</h1>
      <div className="flex flex-col gap-2">
        <div className="typography-small text-text-secondary">
          Install as a PWA for faster loading, offline access, native app experience, and minimal storage usage.
        </div>
        {isInstalled ? (
          <div className="flex flex-row gap-2 items-center">
            <div className="typography-small text-green">✓ App is installed</div>
          </div>
        ) : deferredPrompt ? (
          <Button variant="primary" className="w-full" onClick={handleInstallClick}>
            Install PWA
          </Button>
        ) : (
          <div className="typography-small text-text-secondary">
            Install option will appear when available. Try adding this site to your home screen or bookmarks.
          </div>
        )}
      </div>

      <h1 className="typography-large">Sync</h1>
      <div className="flex flex-col gap-2">
        <div className="typography-regular">Sync Status</div>
        <div className="typography-small text-text-secondary">Sync data across devices. Your data is encrypted before transit. Our servers can't see the contents of your data.</div>
        <div className="flex flex-row gap-2 items-center">
          <Switch onChange={setSyncEnabled} />
          {syncEnabled ? (
            <div className="typography-small text-green">Enabled</div>
          ) : (
            <div className="typography-small text-red">Disabled</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="typography-regular">Sync Code</div>
        <div className="typography-small text-text-secondary">DO NOT SHARE. Treat this code like a password. If someone gets ahold of it, they can read and modify your synced data.</div>
        <CodeBox value={syncCode} onChange={setSyncCode} isHidden isCopyable isRandomizable />
      </div>

      <div className="flex flex-col gap-2">
        <div className="typography-regular">Device Name</div>
        <div className="typography-small text-text-secondary">Make sure this is unique among your devices.</div>
        <CodeBox value={deviceName} onChange={setDeviceName} isEditable />
      </div>

      <h1 className="typography-large">Theme</h1>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" className="flex-1 flex flex-row gap-2 items-center justify-center">
          <MdDarkMode size={24} />
          <div className="typography-small">Dark</div>
        </Button>
        <Button variant="secondary" className="flex-1 flex flex-row gap-2 items-center justify-center">
          <MdLightMode size={24} />
          <div className="typography-small">Light</div>
        </Button>
        <Button variant="primary" className="flex-1 flex flex-row gap-2 items-center justify-center">
          <MdHdrAuto size={24} />
          <div className="typography-small">System</div>
        </Button>
      </div>
    </div>
  )
}