import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { AdvisingRequest } from "./index";
import StatusBadge from "./StatusBadge";

interface Props {
  request: AdvisingRequest;
}

export default function AdvisingRow({ request }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 align-middle font-medium">{request.id}</td>
      <td className="p-4 align-middle">{request.submissionDate}</td>
      <td className="p-4 align-middle">{request.advisor}</td>
      <td className="p-4 align-middle">
        <StatusBadge status={request.status} />
      </td>
      <td className="p-4 align-middle text-right relative z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 flex items-center justify-center"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} className="z-50">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Status</DropdownMenuItem>
            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
