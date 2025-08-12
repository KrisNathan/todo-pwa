import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import TextBox from "../../../components/textbox/TextBox";
import useTodoStore from "../../../stores/todoStore";

export default function RenameWorkspace() {
  const updateWorkspace = useTodoStore((state) => state.updateWorkspace);
  const getWorkspaceById = useTodoStore((state) => state.getWorkspaceById);
  const findWorkspaceByName = useTodoStore((state) => state.getWorkspaceByName);

  const param = useParams();
  const workspaceId = param.workspaceId;

  const workspace = useMemo(() => {
    return getWorkspaceById(workspaceId || '');
  }, [getWorkspaceById, workspaceId])

  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");

  const isValid = useMemo(
    () =>
      0 < workspaceName.trim().length &&
      undefined === findWorkspaceByName(workspaceName),
    [workspaceName, findWorkspaceByName]
  );

  const handleRenameWorkspace = useCallback(() => {
    if (!workspaceId) return;

    updateWorkspace(workspaceId, {
      name: workspaceName.trim(),
    });
    navigate('/');
  }, [workspaceId, workspaceName, updateWorkspace, navigate]);


  if (!workspaceId || !workspace) {
    return (
      <Navigate to='/' />
    )
  }

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">Rename Workspace</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">What should your workspace be renamed to? 🗿❓</div>
      <TextBox
        placeholder="My workspace"
        value={workspaceName}
        onChange={setWorkspaceName}
      />

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button
          variant="primary"
          className="flex-1 !text-center"
          onClick={handleRenameWorkspace}
          disabled={!isValid}
        >
          Done
        </Button>
      </div>
    </FullScreenModal>
  )
}