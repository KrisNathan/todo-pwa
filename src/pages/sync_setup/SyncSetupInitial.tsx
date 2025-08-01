import FullScreenModal from "../../components/modal/FullScreenModal";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function SyncSetupInitial() {
  const navigate = useNavigate();
  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2 items-center">
        <div className="typography-regular flex-1">Sync Setup</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/settings')}>Cancel</Button>
      </div>
      <div className="typography-large">Do you have an existing sync chain?</div>
      <div className="typography-regular text-text-secondary">
        To sync your data with another device, you'll need a Sync Code from it.
      </div>
      <div className="typography-regular text-text-secondary">
        If you don't know then pick No.
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" className="flex-1 !text-center" onClick={() => navigate('/sync_setup/new_chain')}>No</Button>
        <Button variant="primary" className="flex-1 !text-center" onClick={() => navigate('/sync_setup/join_chain')}>Yes</Button>
      </div>
    </FullScreenModal>
  )
}