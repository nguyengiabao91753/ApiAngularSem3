export interface Trip {
    tripId: number;
    departureLocationId?: number;
    arrivalLocationId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    status?: number;
}