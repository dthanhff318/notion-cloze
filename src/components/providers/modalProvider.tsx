"use client";

import { useEffect, useState } from "react";
import CoverImage from "~@/components/modals/coverImageModal";
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
      <CoverImage />
    </>
  );
};
