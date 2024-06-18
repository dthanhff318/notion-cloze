import { useUser } from "@clerk/clerk-react";
import { CircleCheck } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { Input } from "~@/components/ui/input";

const EditProfile = () => {
  const { user } = useUser();
  const nameRef = useRef<HTMLInputElement>(null);
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

  return (
    <div>
      <div className="flex gap-2 items-center">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.imageUrl} />
        </Avatar>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Preferred name</p>
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
    </div>
  );
};

export default EditProfile;
