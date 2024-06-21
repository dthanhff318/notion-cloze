import { useUser } from "@clerk/clerk-react";
import { CircleCheck } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { Input } from "~@/components/ui/input";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";

const EditProfile = () => {
  const { user } = useUser();
  const t = useTranslations();
  const nameRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>(user?.lastName ?? "");

  const updateUser = async () => {
    await user?.update({
      lastName: name,
    });
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      await user?.update({
        lastName: name,
      });
      nameRef.current?.blur();
      e.preventDefault();
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    await user?.setProfileImage({
      file: fileList[0],
    });
  };

  const triggerClick = () => {
    uploadRef.current?.click();
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="hidden"
        type="file"
        onInput={onUpload}
        ref={uploadRef}
      />
      <Avatar role="button" className="h-14 w-14" onClick={triggerClick}>
        <AvatarImage className="object-cover" src={user?.imageUrl} />
      </Avatar>
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs">
          {t(translations.Settings.My_account.Preferred_name)}
        </p>
        <div className="flex items-center">
          <Input
            type="text"
            className="h-7 px-2 bg-secondary w-[170px]"
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {name !== user?.lastName && (
            <CircleCheck
              role="button"
              className="h-7 w-7 ml-4 text-muted-foreground hover:text-primary"
              onClick={updateUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
