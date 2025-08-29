import FullScreenModal from "../../../components/modal/FullScreenModal";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useCodeStore from "../../../stores/codeStore";

export default function SyncSetupNewChain() {
  const navigate = useNavigate();
  const { syncCode, generateSyncCode } = useCodeStore();
  useMemo(() => {
    if (!syncCode) {
      generateSyncCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncCode]);

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Sync Setup</div>
        {/* <Button variant="text" className="text-red" onClick={() => navigate('/settings')}>Cancel</Button> */}
      </div>
      <div className="typography-large">Successfully created new sync chain!</div>
      <div className="typography-regular text-text-secondary">
        To sync your data with another device, you'll need to copy the sync code from this device and paste it on the other device.
      </div>

      <div className="flex flex-col gap-2">
        <div className="p-2 rounded-xl bg-secondary select-all ">
          {syncCode}
        </div>
        <Button variant="secondary" className="w-full" onClick={() => navigator.clipboard.writeText(syncCode || '')}>
          Copy Sync Code
        </Button>
      </div>

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" className="flex-1 !text-center" onClick={() => navigate("/sync_setup")}>Back</Button>
        <Button variant="primary" className="flex-1 !text-center" onClick={() => {
          navigate("/settings");
        }}>Done</Button>
      </div>
    </FullScreenModal>
  )
}