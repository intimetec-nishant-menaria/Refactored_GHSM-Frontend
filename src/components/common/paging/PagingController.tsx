import type { PagingControllerProps } from "@/utils/interfaces/pagingControllerProps";
import Button from "../button/Button";

function PagingController({dataLength,currentPage , itemPerPage , goToPrevious , goToNext ,goToSpecificPage}:PagingControllerProps){
    const totalPages : number = Math.ceil(dataLength/itemPerPage);
    return (
        <div className="w-full flex justify-between"> 
            <Button className={`w-32 h-10 px-3 py-1 text-sm ${currentPage == 1 ? "bg-gray-300" : "bg-blue-600  hover:bg-blue-700"} text-white font-bold rounded `}
                onClick={goToPrevious} label="Previous" disabled={currentPage == 1}>
            </Button>
            <div className="flex justify-between gap-1">
                {
                    Array.from({length : totalPages} , (_ ,i)=>(
                        <Button className={`w-10 h-10 px-3 py-1 text-sm ${currentPage - 1 == i ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold rounded `} key={i}
                            onClick={()=>goToSpecificPage(i+1)}
                            label={`${i+1}`}
                        >
                        </Button>
                    ))
                }
            </div>
            <Button className={`w-32 h-10 px-3 py-1 text-sm ${currentPage == totalPages ? "bg-gray-300" : "bg-blue-600  hover:bg-blue-700"} text-white font-bold rounded`}
                onClick={goToNext}  disabled={currentPage == totalPages} label="Next">
            </Button>
        </div>
    )
}

export default PagingController;