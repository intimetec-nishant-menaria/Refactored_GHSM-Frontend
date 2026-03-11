export interface GuestState{
    id : number ;
    name : string;
    email : string;
    contact : string;
    idProof : string;
    Address : string;
    emergencyContact : string;
}

export interface GuestStatePayload{
    Guests : GuestState[];
    loading : boolean;
    error : string | null;
}

export interface UpdateGuest{
    name : string;
    email : string;
    contact : string;
    idProof : string;
    Address : string;
    emergencyContact : string;
}