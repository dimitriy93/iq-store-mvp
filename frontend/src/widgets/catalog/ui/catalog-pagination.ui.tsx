import {ArrowLeftIcon, ArrowRightIcon} from "@/shared/components/icons";

interface ICatalogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const CatalogPagination = ({ currentPage, totalPages, onPageChange }: ICatalogPaginationProps) => {
    const pageNumbers = Array(totalPages).fill(null).map((_, index) => index + 1);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="catalog__pagination">
            <button
                type="button"
                className="catalog__pagination-button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ArrowLeftIcon/>
            </button>

            {currentPage} / {pageNumbers.length}

            <button
                type="button"
                className="catalog__pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ArrowRightIcon/>
            </button>
        </nav>
    )
}