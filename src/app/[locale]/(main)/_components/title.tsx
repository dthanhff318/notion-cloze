import { useMutation } from "convex/react";
import React, { useRef, useState } from "react";
import { Button } from "~@/components/ui/button";
import { Input } from "~@/components/ui/input";
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";
import { Skeleton } from "~@/components/ui/skeleton";

type Props = {
  initialData: Doc<"documents">;
};

const Title = ({ initialData }: Props) => {
  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current?.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={disableInput}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-"
        >
          {initialData?.title}
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-4 w-20 rounded-md" />;
};

export default Title;
