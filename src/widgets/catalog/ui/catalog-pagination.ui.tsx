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
                aria-label="Предыдущая страница"
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ArrowLeftIcon/>
            </button>

            {pageNumbers.map(page => (
                <button
                    key={page}
                    type="button"
                    className={currentPage === page ? "catalog__pagination-button active" : "catalog__pagination-button"}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                className="catalog__pagination-button"
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ArrowRightIcon/>
            </button>
        </nav>
    )
}