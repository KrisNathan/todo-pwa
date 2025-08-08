import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Button from "../../../components/Button";
import FullScreenModal from "../../../components/modal/FullScreenModal";
import TextBox from "../../../components/textbox/TextBox";
import useTodoStore from "../../../stores/todoStore";

export default function NewWorkspace() {
  const navigate = useNavigate();
  const addWorkspace = useTodoStore((state) => state.addWorkspace);
  const findWorkspaceByName = useTodoStore((state) => state.getWorkspaceByName);
  const [workspaceName, setWorkspaceName] = useState("");

  const isValid = useMemo(
    () =>
      0 < workspaceName.trim().length &&
      undefined === findWorkspaceByName(workspaceName),
    [workspaceName, findWorkspaceByName]
  );

  const handleCreateWorkspace = () => {
    if (workspaceName.trim()) {
      addWorkspace({
        name: workspaceName.trim(),
        id: crypto.randomUUID(), // Generate a unique ID for the workspace
      });
      navigate('/');
    }

    navigate('/');
  };

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2">
        <div className="typography-regular flex-1">New Task</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="typography-large">What should your new workspace be called? 🗿❓</div>
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
          onClick={handleCreateWorkspace}
          disabled={!isValid}
        >
          Done
        </Button>
      </div>
    </FullScreenModal>
  )
}