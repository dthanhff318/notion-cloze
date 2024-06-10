import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Props = {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
};

type TEmojiData = {
  native: string;
};

const IconPicker = ({ onChange, children, asChild }: Props) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };
  const theme = themeMap[currentTheme];
  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        {/* <EmojiPicker
          height={350}
          theme={theme}
          lazyLoadEmojis={true}
          emojiStyle={EmojiStyle.GOOGLE}
          previewConfig={{
            showPreview: false,
          }}
          onEmojiClick={(data) => onChange(data.emoji)}
        /> */}
        <Picker
          height={350}
          maxFrequentRows={2}
          perLine={7}
          data={data}
          theme={theme}
          previewPosition="none"
          onEmojiSelect={(data: TEmojiData) => onChange(data.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
