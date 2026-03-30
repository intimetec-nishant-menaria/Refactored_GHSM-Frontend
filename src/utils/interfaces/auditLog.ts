export interface AuditLogArgs{
    pageSize : number;
    currentPage : number ;
    entityName : string;
    id : string;
}

export interface FetchAuditResponce{
    userName : string;
    userEmail : string ;
    entityName : string;
    Action : string;
    oldValue : string;
    newValue : string;
}