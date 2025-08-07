import { useState } from "react";
import CodeBox from "../components/textbox/CodeBox";
import Button from "../components/Button";
import { MdDarkMode, MdHdrAuto, MdLightMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useCodeStore from "../stores/codeStore";
import useInstallStore from "../stores/installStore";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { syncCode, setSyncCode } = useCodeStore();
  const [deviceName, setDeviceName] = useState("My Device");

  const { isInstalled, deferredPrompt, setDeferredPrompt } = useInstallStore();

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

      <div className="flex flex-col gap-2">
        <h1 className="typography-large">Install</h1>
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

      <div className="flex flex-col gap-2">
        <h1 className="typography-large">Sync</h1>
        <div className="typography-small text-text-secondary">Sync data across devices. Your data is encrypted before transit. Our servers can't see the contents of your data.</div>
        <Button className="w-full" onClick={() => navigate('/sync_setup')}>Enable Sync</Button>
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

      <div className="flex flex-col gap-2">
        <h1 className="typography-large">Theme</h1>
        <div className="flex flex-row gap-2">
          <Button variant="secondary" className="flex-1 flex flex-row gap-2 items-center justify-center">
            <MdDarkMode size={24} />
            <div className="typography-regular">Dark</div>
          </Button>
          <Button variant="secondary" className="flex-1 flex flex-row gap-2 items-center justify-center">
            <MdLightMode size={24} />
            <div className="typography-regular">Light</div>
          </Button>
          <Button variant="primary" className="flex-1 flex flex-row gap-2 items-center justify-center">
            <MdHdrAuto size={24} />
            <div className="typography-regular">System</div>
          </Button>
        </div>
      </div>
    </div>
  )
}