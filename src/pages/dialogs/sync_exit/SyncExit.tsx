import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import useCodeStore from "../../../stores/codeStore";

export default function SyncExit() {
  const [countdown, setCountdown] = useState(2);

  const navigate = useNavigate();

  const syncCode = useCodeStore((s) => s.syncCode);
  const exitSyncChain = useCodeStore((s) => s.exitSyncChain);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSyncExit = useCallback(() => {
    exitSyncChain();
    navigate('/settings');
  }, [navigate, exitSyncChain]);

  if (!syncCode) {
    return (
      <Navigate to='/settings' />
    )
  }

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Exitting Sync Chain</div>
        <Button variant="text" className="text-accent" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">Are you sure you wish to exit sync chain?</div>
      <div className="typography-regular text-red">This action cannot be reverted!</div>

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button
          variant="danger"
          className="flex-1 !text-center"
          onClick={handleSyncExit}
          disabled={countdown > 0}
        >
          Exit Sync Chain{countdown > 0 ? ` (${countdown}s)` : ''}
        </Button>
      </div>
    </FullScreenModal>
  )
}