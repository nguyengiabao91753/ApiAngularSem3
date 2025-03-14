export interface BusesTrip{
    busTripId?: number;
    busId?: number;

    // Bus
    busTypeName?: string;
    airConditioned?: number;
    seatCount?: number;
    licensePlate?:string
    // .

    tripId?: number;

    // Trip
    departureLocationName?: string;
    arrivalLocationName?: string;
    dateStart?: string;
    dateEnd?: string;
    // .

    price?: string;
    status?: number | null;
}