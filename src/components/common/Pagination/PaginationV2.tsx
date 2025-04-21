
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxDisplayedPages?: number;
}

export function PaginationV2({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayedPages = 6,
}: PaginationProps) {
  // Prevent invalid current page
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  // Calculate which page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate the range of pages to show
    let rangeStart = validCurrentPage - Math.floor(maxDisplayedPages / 2);
    let rangeEnd = validCurrentPage + Math.floor(maxDisplayedPages / 2);
    
    // Adjust range if it goes out of bounds
    if (rangeStart <= 1) {
      rangeStart = 2;
      rangeEnd = Math.min(totalPages, maxDisplayedPages);
    }
    
    if (rangeEnd >= totalPages) {
      rangeEnd = totalPages - 1;
      rangeStart = Math.max(2, totalPages - maxDisplayedPages + 1);
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push("ellipsis1");
    }
    
    // Add page numbers in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("ellipsis2");
    }
    
    // Always show last page if not already included
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Early return if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-6">
      <ul className="flex space-x-1 items-center">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            className={`flex items-center justify-center px-3 py-2 rounded-md ${
              validCurrentPage === 1
                ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            }`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis1" || page === "ellipsis2") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-3 py-2 text-gray-700 dark:text-gray-300">...</span>
              </li>
            );
          }

          return (
            <li key={`page-${page}`}>
              <button
                onClick={() => onPageChange(Number(page))}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  validCurrentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                }`}
                aria-label={`Page ${page}`}
                aria-current={validCurrentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            className={`flex items-center justify-center px-3 py-2 rounded-md ${
              validCurrentPage === totalPages
                ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            }`}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}