import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

function getPageWindow(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "...")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
}

const btnBase =
  "inline-flex items-center justify-center rounded-md border-2 border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 select-none";

const btnActive =
  "inline-flex items-center justify-center rounded-md border-2 border-gray-700 px-3 py-1.5 text-sm font-bold bg-gray-800 text-white select-none";

const btnDisabled =
  "inline-flex items-center justify-center rounded-md border-2 border-gray-500 px-3 py-1.5 text-sm font-medium text-gray-500 cursor-not-allowed select-none";

const AdminPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: AdminPaginationProps) => {
  if (totalPages <= 1) return null;

  const window = getPageWindow(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <Pagination className="mt-6">
      <PaginationContent className="list-none flex-wrap gap-2">

        {/* Previous */}
        <PaginationItem>
          <button
            onClick={() => !isFirst && setCurrentPage(currentPage - 1)}
            className={isFirst ? btnDisabled : btnBase}
            disabled={isFirst}
          >
            ‹ Prev
          </button>
        </PaginationItem>

        {/* First page jump — only when page 1 is out of window view */}
        {currentPage > 3 && (
          <PaginationItem>
            <button
              onClick={() => setCurrentPage(1)}
              className={btnBase}
            >
              «
            </button>
          </PaginationItem>
        )}

        {/* Numbered window */}
        {window.map((entry, i) =>
          entry === "..." ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <span className="px-2 text-gray-400 select-none">…</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <button
                onClick={() => setCurrentPage(entry)}
                className={entry === currentPage ? btnActive : btnBase}
              >
                {entry}
              </button>
            </PaginationItem>
          )
        )}

        {/* Last page jump — only when last page is out of window view */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={btnBase}
            >
              »
            </button>
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem>
          <button
            onClick={() => !isLast && setCurrentPage(currentPage + 1)}
            className={isLast ? btnDisabled : btnBase}
            disabled={isLast}
          >
            Next ›
          </button>
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
};

export default AdminPagination;
