"use client";

import { Dialog, DialogContent } from "~@/components/ui/dialog";
import { useSettings } from "~@/hooks/useSettings";
import SettingsWrap from "../settings/settingsWrap";

const SettingsModal = () => {
  const settings = useSettings();
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="max-w-[1150px] w-[80vw] max-h-[700px] h-[80vh] block p-0">
        <div className="h-full">
          <SettingsWrap />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
