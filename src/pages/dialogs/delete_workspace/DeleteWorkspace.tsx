import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import useTodoStore from "../../../stores/todoStore";

export default function DeleteWorkspace() {
  const deleteWorkspace = useTodoStore((state) => state.removeWorkspace);
  const getWorkspaceById = useTodoStore((state) => state.getWorkspaceById);
  const defaultWorkspaceId = useTodoStore((state) => state.defaultWorkspaceId);
  const [countdown, setCountdown] = useState(2);

  const param = useParams();
  const workspaceId = param.workspaceId;

  const workspace = useMemo(() => {
    return getWorkspaceById(workspaceId || '');
  }, [getWorkspaceById, workspaceId])

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  const handleDeleteWorkspace = useCallback(() => {
    if (!workspaceId) return;

    deleteWorkspace(workspaceId);
    navigate('/');
  }, [workspaceId, deleteWorkspace, navigate]);

  if (!workspaceId || !workspace || defaultWorkspaceId === workspaceId) {
    return (
      <Navigate to='/' />
    )
  }

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Deleting Workspace</div>
        <Button variant="text" className="text-accent" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">Are you sure you wish to delete workspace '{workspace.name}'?</div>
      <div className="typography-regular text-red">All tasks in this workspace will also be removed.</div>
      <div className="typography-regular text-red">This action cannot be reverted!</div>

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button
          variant="danger"
          className="flex-1 !text-center"
          onClick={handleDeleteWorkspace}
          disabled={countdown > 0}
        >
          Delete{countdown > 0 ? ` (${countdown}s)` : ''}
        </Button>
      </div>
    </FullScreenModal>
  )
}