"use client";

import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Banner from "~@/app/[locale]/(main)/_components/banner";
import Menu from "~@/app/[locale]/(main)/_components/menu";
import Share from "~@/app/[locale]/(main)/_components/share";
import Title from "~@/app/[locale]/(main)/_components/title";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";

type Props = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};
const Navbar = ({ isCollapsed, onResetWidth }: Props) => {
  const { documentId } = useParams<{ documentId: Id<"documents"> }>();
  const document = useQuery(api.documents.getById, {
    documentId,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between gap-x-4">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }
  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center">
        {isCollapsed && (
          <MenuIcon
            role="button"
            className="h-6 w-6 text-muted-foreground mr-2"
            onClick={onResetWidth}
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-start gap-x-2">
            <Share initialData={document} />
            <Menu document={document} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

export default Navbar;
