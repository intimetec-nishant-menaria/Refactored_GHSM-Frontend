import type { PagingControllerProps } from "@/utils/interfaces/pagingControllerProps";
import Button from "../button/Button";

function PagingController({
  dataLength,
  currentPage,
  itemPerPage,
  goToPrevious,
  goToNext,
  goToSpecificPage
}: PagingControllerProps) {
  const totalPages: number = Math.ceil(dataLength / itemPerPage);

  if (totalPages <= 1 && dataLength > 0) return null;

  return (
    <div className="w-full flex justify-between items-center bg-surface p-2 rounded-2xl border border-border shadow-sm">
      <Button
        className={`w-32 h-10 px-3 py-1 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
          currentPage === 1
            ? "bg-muted text-text-muted cursor-not-allowed opacity-50"
            : "bg-primary text-surface hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95"
        }`}
        onClick={goToPrevious}
        label="Previous"
        disabled={currentPage === 1}
      />

      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;

          return (
            <Button
              key={i}
              className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-all rounded-xl ${
                isActive
                  ? "bg-primary text-surface shadow-md shadow-primary/20 scale-110"
                  : "bg-layout/50 text-text-muted hover:bg-muted hover:text-text-main"
              }`}
              onClick={() => goToSpecificPage(pageNum)}
              label={`${pageNum}`}
            />
          );
        })}
      </div>

      <Button
        className={`w-32 h-10 px-3 py-1 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
          currentPage === totalPages || totalPages === 0
            ? "bg-muted text-text-muted cursor-not-allowed opacity-50"
            : "bg-primary text-surface hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95"
        }`}
        onClick={goToNext}
        disabled={currentPage === totalPages || totalPages === 0}
        label="Next"
      />
    </div>
  );
}

export default PagingController;