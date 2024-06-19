import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~@/components/ui/select";
import { Label } from "~@/components/ui/label";

const Language = () => {
  return (
    <div className="flex items-center justify-between">
      <Label className="flex flex-col gap-y-1 flex-1">
        <p className="text-sm font-medium">Language</p>
        <span className="text-[0.8rem] text-muted-foreground">
          Change the language used in the user interface.
        </span>
      </Label>
      <Select>
        <SelectTrigger className="w-[150px] border-none">
          <SelectValue className="border-none" placeholder="English" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">English</SelectItem>
          <SelectItem value="dark">Vietnamese</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Language;
