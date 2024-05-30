import { Pen } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { useAvatar } from "./hook";

export default function EditAvatar() {
  const hook = useAvatar();

  return (
    <Popover>
      <PopoverTrigger
        className="absolute right-[-1rem] top-[67%] flex items-center justify-center"
        asChild
      >
        <Button variant="secondary" className="py-2 px-3">
          <span className="mr-1">
            <Pen className="h-3 w-3" />
          </span>
          <span className="text-sm">Edit</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!px-0 !py-0">
        <div className=" flex flex-col items-center justify-center text-center text-sm">
          <Label className="w-full block px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-green-700 transition-all rounded-t-md">
            <span>Upload a photo</span>
            <Input
              name="avatar"
              type="file"
              accept=".jpg, .jpeg, .png"
              className="sr-only"
              onChange={hook.handleUpload}
            />
          </Label>
          <button
            className="px-4 py-2 block w-full text-red-700 hover:bg-red-700 hover:text-white transition-all rounded-b-md"
            type="button"
            onClick={() => hook.updateAvatar({ type: "delete" })}
          >
            Remove Avatar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
