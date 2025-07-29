import FullScreenModal from "../../components/modal/FullScreenModal";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import useCodeStore from "../../stores/codeStore";

export default function SyncCodeDialog() {
  const navigate = useNavigate();
  const { setSyncCode } = useCodeStore();

  const [tempCode, setTempCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  const isEmpty = useMemo(() => {
    return tempCode.trim() === "";
  }, [tempCode]);

  return (
    <FullScreenModal className="flex flex-col gap-4 p-4 bg-background">
      <div className="flex flex-row gap-2 items-center">
        <div className="typography-regular flex-1">Sync Setup</div>
        <Button variant="text" className="text-red" onClick={() => navigate('/settings')}>Cancel</Button>
      </div>
      <div className="typography-large">Enter your sync code</div>
      <div className="typography-regular text-text-secondary">
        It has to be a valid sync code. They consist of 24 randomized words
      </div>

      <textarea
        className="p-2 rounded-xl bg-secondary select-all h-20 resize-none"
        placeholder="Enter sync code here"
        value={tempCode}
        onChange={(e) => {
          setTempCode(e.target.value);

          if (validateMnemonic(e.target.value, wordlist)) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        }}
      />
      {!isValid && !isEmpty &&
        <div className="text-red typography-small">Invalid sync code!</div>
      }

      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button variant="secondary" className="flex-1 !text-center" onClick={() => navigate("/sync_setup")}>Back</Button>
        <Button variant="primary" className="flex-1 !text-center" disabled={!isValid} onClick={() => {
          setSyncCode(tempCode);
          navigate("/settings");
        }}>Done</Button>
      </div>
    </FullScreenModal>
  )
}