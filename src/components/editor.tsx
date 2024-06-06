"use client";
import React from "react";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

type Props = {
  onChange: (value: string) => void;
  initialContent: string;
  editable?: boolean;
};

const Editor = ({ initialContent, editable, onChange }: Props) => {
  // const editor = useBlockNo/
  return <div>Editor</div>;
};

export default Editor;
