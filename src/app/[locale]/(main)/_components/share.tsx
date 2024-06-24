"use client";
import { Globe } from "lucide-react";
import Publish from "~@/app/[locale]/(main)/_components/publish";
import { Button } from "~@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~@/components/ui/tabs";
import { Doc } from "~convex/_generated/dataModel";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";
import Invite from "./invite";

type Props = {
  initialData: Doc<"documents">;
};

const Share = ({ initialData }: Props) => {
  const t = useTranslations();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          {t(translations.Share.Share.Share)}
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" alignOffset={8} forceMount>
        <Tabs defaultValue="share" className="">
          <TabsList>
            <TabsTrigger value="share" className="text-xs">
              {t(translations.Share.Share.Share)}
            </TabsTrigger>
            <TabsTrigger value="publish" className="text-xs">
              {t(translations.Share.Publish.Publish)}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="share">
            <Invite initialData={initialData} />
          </TabsContent>
          <TabsContent value="publish">
            <div className="mt-4">
              <Publish initialData={initialData} />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default Share;
