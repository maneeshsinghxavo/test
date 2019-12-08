export class Cordinate {
    latitude : number;
    longitude : number;
}

export class Param {
    rooms : number;
    value : number;
}

export class House {
    cordinate: Cordinate;
    params : Param;
    street : string;
}
