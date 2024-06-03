"use client";

import { ReactNode, useEffect, useState } from "react";
import SettingsModal from "~@/components/modals/settingsModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <SettingsModal />
    </>
  );
};
