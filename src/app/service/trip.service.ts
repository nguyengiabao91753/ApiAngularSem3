import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TripService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async create(trip: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'trip/create', trip));
    }
    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'trip/getall'));
    }
    async update(trip: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'trip/update', trip));
    }
    async delete(id: number){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'trip/delete', id));
    }
    async findById(id: any){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL + 'trip/find-by-id/' + id))
    }
  // Phương thức kiểm tra chuyến đi
    checkDuplicateTrip(departureLocationId: number, arrivalLocationId: number , dateStart : string): Observable<any> {
        return this.httpClient.get(this.baseurl.BASE_URL +`trip/check-duplicate-trip?departureLocationId=${departureLocationId} ,arrivalLocationId=${arrivalLocationId} ,dateStart=${dateStart} `);
        }

}