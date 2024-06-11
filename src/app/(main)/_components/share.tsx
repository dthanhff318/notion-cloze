"use client";
import { Globe } from "lucide-react";
import Publish from "~@/app/(main)/_components/publish";
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

type Props = {
  initialData: Doc<"documents">;
};

const Share = ({ initialData }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Share
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" alignOffset={8} forceMount>
        <Tabs defaultValue="share" className="">
          <TabsList>
            <TabsTrigger value="share" className="text-xs">
              Share
            </TabsTrigger>
            <TabsTrigger value="publish" className="text-xs">
              Publish
            </TabsTrigger>
          </TabsList>
          <TabsContent value="share">
            <p className="font-bold text-xs mt-4 ml-2">Coming soon...</p>
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
