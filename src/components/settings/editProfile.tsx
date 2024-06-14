import React from "react";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import { Input } from "~@/components/ui/input";
import { getUser } from "~@/app/api/clerk/route";

const EditProfile = () => {
  const { user } = useUser();
  const abc = async () => {
    const res = await getUser();
    console.log(res.data);
  };
  abc();
  return (
    <div>
      <div className="flex gap-2 items-center">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.imageUrl} />
        </Avatar>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Preferred name</p>
          <Input type="text" className="h-7 px-2  bg-secondary" />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
