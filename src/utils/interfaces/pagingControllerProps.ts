export interface PagingControllerProps{
    dataLength :number;
    itemPerPage :number;
    currentPage : number;
    goToPrevious : ()=>void;
    goToNext : ()=>void;
    goToSpecificPage : (pageNumber:number)=>void;
}