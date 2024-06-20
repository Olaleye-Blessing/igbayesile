import { Info, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";

import { copyToClipboard } from "@ui/utils/copy-to-clipboard";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

import { Row } from "@tanstack/react-table";
import { ITableRoom } from "./types";
import { handleIgbayesileAPIError } from "@dashboard/utils/handle-igbayesile-api-error";
import { useRooms } from "../../../_utils/hook";
import toast from "react-hot-toast";
import { useState } from "react";

interface IActions {
  row: Row<ITableRoom>;
}

export default function Actions({ row }: IActions) {
  const room = row.original;
  const [hidden, setHidden] = useState(room.hidden || false);
  const { updateRoom } = useRooms();

  const toggleRoomVisibility = async () => {
    const toastId = `update-hotel-rooms-${room._id}-visibility`;

    toast.loading("Updating room", { id: toastId });

    try {
      await updateRoom.mutateAsync({
        room,
        body: { hidden: !hidden },
        path: "visibility",
      });

      toast.success("Room updated successfully", { id: toastId });
      setHidden((prev) => !prev);
    } catch (error) {
      toast.error(handleIgbayesileAPIError(error), { id: toastId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={toggleRoomVisibility}
          className="flex items-center justify-start cursor-pointer disabled:cursor-not-allowed"
          disabled={updateRoom.status === "pending"}
        >
          <span className="mr-1">{hidden ? "Show" : "Hide"}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-primary" />
              </TooltipTrigger>
              <TooltipContent className=" max-w-64">
                <p>
                  Hide this room from being booked. This is useful for situation
                  where you want to renovate the room.
                </p>
                <p className="mt-1">
                  Note that guests can still check this room out if it has
                  already been booked.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await copyToClipboard(room._id)}>
          Copy room ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
