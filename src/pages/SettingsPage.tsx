import { useState } from "react";
import Switch from "../components/Switch";
import CodeBox from "../components/textbox/CodeBox";
import Button from "../components/Button";
import { MdDarkMode, MdHdrAuto, MdLightMode } from "react-icons/md";

export default function SettingsPage() {
  const [syncEnabled, setSyncEnabled] = useState(false);

  const [syncCode, setSyncCode] = useState("your-sync-code-here");

  const [deviceName, setDeviceName] = useState("My Device");

  return (
    <div className="flex flex-col w-full h-full gap-4 select-none">
      <div>WORK IN PROGRESS</div>

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
        <CodeBox value={syncCode} onChange={setSyncCode} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="typography-regular">Device Name</div>
        <div className="typography-small text-text-secondary">Make sure this is unique among your devices.</div>
        <CodeBox value={deviceName} onChange={setDeviceName} />
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