import { useState } from "react";
import { MdContentCopy, MdEdit, MdCheck, MdClose } from "react-icons/md";
import IconButton from "../IconButton";

interface CodeBoxProps {
  value?: string;
  onChange?: (newValue: string) => void;
}

export default function CodeBox({ value = "", onChange }: CodeBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const handleEditClick = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue("");
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="flex flex-row gap-2">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 typography-regular rounded-xl px-4 py-2 bg-secondary border-none outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="flex-1 typography-regular rounded-xl px-4 py-2 bg-secondary hover:bg-secondary-hover cursor-pointer text-text-secondary" onClick={handleCopy}>
          {'•'.repeat(8)}
        </div>
      )}
      
      {isEditing ? (
        <>
          <IconButton variant="secondary" className="p-2" onClick={handleSave}>
            <MdCheck size={24} color="var(--fun-color-text-secondary)" />
          </IconButton>
          <IconButton variant="secondary" className="p-2" onClick={handleCancel}>
            <MdClose size={24} color="var(--fun-color-text-secondary)" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton variant="secondary" className="p-2" onClick={handleEditClick}>
            <MdEdit size={24} color="var(--fun-color-text-secondary)" />
          </IconButton>
          <IconButton variant="secondary" className="p-2" onClick={handleCopy}>
            <MdContentCopy size={24} color="var(--fun-color-text-secondary)" />
          </IconButton>
        </>
      )}
    </div>
  );
}