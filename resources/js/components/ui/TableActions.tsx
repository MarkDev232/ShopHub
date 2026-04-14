import { MoreHorizontalIcon, Trash, Pencil, Eye, FileInput } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type TableActionsProps = {
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onView?: () => void;
    onReview?: () => void;
};

export default function TableActions({
    onEdit,
    onDelete,
    onDuplicate,
    onView,
    onReview,
    
}: TableActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 ">
                    <MoreHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {onReview && (
                    <DropdownMenuItem onClick={onReview}
                       >
                        <FileInput  className="size-4 mr-2 text-green-600 hover:text-primary" />
                        Review Application
                    </DropdownMenuItem>
                )}
                {onView && (
                    <DropdownMenuItem onClick={onView}
                       >
                        <Eye className="size-4 mr-2 text-green-600 hover:text-primary" />
                        View
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem onClick={onEdit}
                       >
                        <Pencil className="size-4 mr-2 text-blue-600 hover:text-primary" />
                        Edit
                    </DropdownMenuItem>
                )}

                {onDuplicate && (
                    <DropdownMenuItem onClick={onDuplicate}>
                        Duplicate
                    </DropdownMenuItem>
                )}

                {(onEdit || onDuplicate) && <DropdownMenuSeparator />}

                {onDelete && (
                    <DropdownMenuItem
                        onClick={onDelete}
                        
                    >
                        <Trash className="size-4 mr-2 text-red-600 hover:text-primary" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}