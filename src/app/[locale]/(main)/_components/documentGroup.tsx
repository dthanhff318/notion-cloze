import { Ellipsis } from "lucide-react";
import DocumentFavourite from "./documentFavourite";
import DocumentList from "./documentList";

const DocumentGroup = () => {
  const listCategory = [
    {
      title: "Favourite",
      component: <DocumentFavourite />,
    },
    {
      title: "Private",
      component: <DocumentList />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
      {listCategory.map((e) => (
        <div key={e.title}>
          <div
            role="button"
            className="group px-3 py-2 w-full flex items-center justify-between hover:bg-primary/5"
          >
            <span className="text-xs text-muted-foreground font-bold">
              {e.title}
            </span>
            <Ellipsis className="w-4 h-4 rounded-sm text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600 opacity-0 group-hover:opacity-100" />
          </div>
          {e.component}
        </div>
      ))}
    </div>
  );
};

export default DocumentGroup;
