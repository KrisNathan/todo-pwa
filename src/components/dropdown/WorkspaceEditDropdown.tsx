import { useNavigate } from "react-router-dom";
import useTodoStore from "../../stores/todoStore";
import Dropdown from "./Dropdown";
import { MdMoreVert } from "react-icons/md";
import Button from "../Button";
import { useMemo, useState } from "react";

export default function WorkspaceEditDropdown() {
  const currentWorkspaceId = useTodoStore((state) => state.currentWorkspaceId);
  const defaultWorkspaceId = useTodoStore((state) => state.defaultWorkspaceId);
  const navigate = useNavigate();

  const currentIsDefaultWorkspace = useMemo(() => {
    return currentWorkspaceId === defaultWorkspaceId;
  }, [currentWorkspaceId, defaultWorkspaceId]);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleRename = () => {
    if (currentWorkspaceId) {
      navigate(`/workspace/${currentWorkspaceId}/rename`);
    }
    handleClose();
  }

  const handleDelete = () => {
    if (currentWorkspaceId) {
      navigate(`/workspace/${currentWorkspaceId}/delete`);
    }
    handleClose();
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      label={<MdMoreVert size={24} color='var(--fun-color-text)' />}
      buttonVariant="secondary"
      alignment="right"
      isFitContent
    >
      <Button variant="text" onClick={handleRename} disabled={currentIsDefaultWorkspace}>Rename</Button>
      <Button variant="text" onClick={handleDelete} disabled={currentIsDefaultWorkspace}>Delete</Button>

      {currentIsDefaultWorkspace && (
        <div className="typography-small text-text-secondary select-none p-2">Can't modify default workspace.</div>
      )}
    </Dropdown>
  );
}
