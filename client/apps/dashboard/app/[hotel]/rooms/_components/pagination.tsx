import PaginationComp from "@ui/components/paginated-page";

interface IPagination {
  onPageChange(page: number): void;
  totalRooms: number;
  currentPage: number;
  pageSize: number;
}

export default function Pagination({
  totalRooms,
  currentPage,
  pageSize,
  onPageChange,
}: IPagination) {
  return (
    <PaginationComp
      onPageChange={(page) => onPageChange(page)}
      totalCount={totalRooms}
      currentPage={currentPage}
      pageSize={pageSize}
      className="py-[0.4rem] w-full cardboard cardboard--outline"
    />
  );
}
