// components/ui/DataTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { Frown } from 'lucide-react';

type Column<T> = {
  label: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
};

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-100 text-gray-500">
      Loading...
    </div>
  );
}

if (data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 text-gray-500">
  <Frown className="w-30 h-30 mb-2" />
  <span>No data found.</span>
</div>
  );
}

  return (
    <div className="shadow-sm rounded-2xl border overflow-hidden">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.render
                    ? col.render(row)
                    : (row[col.key as keyof T] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Shadcn-style Pagination */}
      {pagination && onPageChange && (
        <Pagination className="my-4">
          <PaginationPrevious
            onClick={() =>
              onPageChange(Math.max(pagination.current_page - 1, 1))
            }
          />

          <PaginationContent>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (page) => {
                // Use ellipsis logic for pages far from current
                if (
                  page === 1 ||
                  page === pagination.last_page ||
                  (page >= pagination.current_page - 2 &&
                    page <= pagination.current_page + 2)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === pagination.current_page}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === pagination.current_page - 3 ||
                  page === pagination.current_page + 3
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                } else return null;
              }
            )}
          </PaginationContent>

          <PaginationNext
            onClick={() =>
              onPageChange(
                Math.min(pagination.current_page + 1, pagination.last_page)
              )
            }
          />
        </Pagination>
      )}
    </div>
  );
}