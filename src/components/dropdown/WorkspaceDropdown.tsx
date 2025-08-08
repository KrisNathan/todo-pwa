import { useNavigate } from "react-router-dom";
import Button from "../Button";
import DropdownSelect from "./DropdownSelect";
import { useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import useTodoStore from "../../stores/todoStore";

export default function WorkspaceDropdown() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const currentWorkspaceId = useTodoStore(state => state.currentWorkspaceId);
  const setCurrentWorkspaceId = useTodoStore(state => state.setCurrentWorkspaceId);
  const workspaces = useTodoStore(state => state.workspaces);
  
  const onSelect = (value: string | number) => {
    setCurrentWorkspaceId(value as string);
  };

  const onNewWorkspace = () => {
    navigate("/workspace/new");
    closeDropdown();
  }

  return (
    <DropdownSelect
      selectedValue={currentWorkspaceId}
      options={workspaces.map(workspace => ({
        value: workspace.id,
        label: workspace.name,
      }))}
      isOpen={isOpen}
      onOpen={openDropdown}
      onClose={closeDropdown}
      onSelect={onSelect}
      className="w-full"
    >
      <Button
        variant="secondary"
        className="p-2 hover:bg-secondary cursor-pointer"
        onClick={onNewWorkspace}
      >
        <div className="text-text-secondary flex flex-row">
          <div className="flex-1">
            New Workspace
          </div>
          <MdPlaylistAdd size={24} color='var(--fun-color-text-secondary)' />
        </div>
      </Button>
    </DropdownSelect>
  )
}