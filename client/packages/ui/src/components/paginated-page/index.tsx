import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { usePagination } from "./hook";
import { DOTS } from "./utils";
import PaginationItem from "./item";
import { nanoid } from "nanoid";

interface PaginationProps {
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}: PaginationProps) {
  const { paginationRange } = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={cn(["flex items-center justify-center", className])}>
      <PaginationItem
        type="page"
        className={`${currentPage === 1 ? "disabled" : ""}`}
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </PaginationItem>

      {paginationRange.map((pageNumber) => {
        //   TODO: Replace the nanoid() key here with unique key
        if (pageNumber === DOTS)
          return <PaginationItem key={nanoid()} type="dot" />;

        return (
          <PaginationItem
            key={pageNumber}
            type="page"
            onClick={() => onPageChange(Number(pageNumber))}
            className={`${
              pageNumber === currentPage
                ? "bg-primary hover:bg-black hover:text-primary"
                : "hover:text-primary"
            }`}
          >
            {pageNumber}
          </PaginationItem>
        );
      })}

      <PaginationItem
        type="page"
        onClick={onNext}
        className={`${currentPage === lastPage ? "disabled" : ""}`}
        disabled={currentPage === lastPage}
      >
        <ChevronRight />
      </PaginationItem>
    </ul>
  );
}
