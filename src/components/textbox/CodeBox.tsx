import { useState } from "react";
import { MdContentCopy, MdEdit, MdCheck, MdClose, MdRefresh } from "react-icons/md";
import IconButton from "../IconButton";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

interface CodeBoxProps {
  value?: string;
  onChange?: (newValue: string) => void;
  isHidden?: boolean;
  isCopyable?: boolean;
  isEditable?: boolean;
  isRandomizable?: boolean;
}

export default function CodeBox({ value = "", onChange, isHidden = false, isCopyable = false, isEditable = false, isRandomizable = false }: CodeBoxProps) {
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
    <div className="flex flex-row gap-2 w-full">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 min-w-0 typography-regular rounded-xl px-4 py-2 bg-secondary border-none outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className={`flex-1 typography-regular rounded-xl px-4 py-2 bg-secondary text-text-secondary ${isCopyable ? 'hover:bg-secondary-hover cursor-pointer' : ''}`} onClick={isCopyable ? handleCopy : () => { }}>
          {isHidden ? '•'.repeat(8) : value}
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
          {isRandomizable && (
            <IconButton variant="secondary" className="p-2" onClick={() => {
              const mn = generateMnemonic(wordlist, 256);
              onChange?.(mn);
              setEditValue(mn);
            }}>
              <MdRefresh size={24} color="var(--fun-color-text-secondary)" />
            </IconButton>
          )}
          {isEditable &&
            <IconButton variant="secondary" className="p-2" onClick={handleEditClick}>
              <MdEdit size={24} color="var(--fun-color-text-secondary)" />
            </IconButton>
          }
          {isCopyable &&
            <IconButton variant="secondary" className="p-2" onClick={handleCopy}>
              <MdContentCopy size={24} color="var(--fun-color-text-secondary)" />
            </IconButton>
          }
        </>
      )}
    </div>
  );
}