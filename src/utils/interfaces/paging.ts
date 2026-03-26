export interface paging<T>{
    data : T;
    metaData : PagingMetaData;
}

export interface PagingMetaData{
    totalCount: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
}