import Dropdown from "./Dropdown";
import { useState } from "react";

export default function WorkspaceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const openDropdown = () => {
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
  };

  const [value, setValue] = useState("workspace1");

  const onSelect = (value: string | number) => {
    console.log("Selected workspace:", value);
    setValue(value as string);
  };

  return (
    <Dropdown
      selectedValue={value}
      options={[
        { label: "Workspace 1", value: "workspace1" },
        { label: "Workspace 2", value: "workspace2" },
        { label: "Workspace 3", value: "workspace3" }
      ]}
      isOpen={isOpen}
      onOpen={openDropdown}
      onClose={closeDropdown}
      onSelect={onSelect}
      className="w-full"
    />
  )
}