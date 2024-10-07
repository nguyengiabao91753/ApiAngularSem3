import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class BusService{

    constructor(
        private httpClient: HttpClient,
        private baseUrl: BaseUrlService
    ){}

    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'Bus/get-all-bus'));
    }

    async findById(id: string){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'Bus/find-by-id/' + id))
    }

    async create(bus: any){
        return lastValueFrom(this.httpClient.post(this.baseUrl.BASE_URL + 'Bus/create-bus', bus));
    }

    async update(bus: any){
        return lastValueFrom(this.httpClient.post(this.baseUrl.BASE_URL + 'Bus/update-bus' , bus))
    }

    checkLicensePlateExist(licensePlate: string): Observable<any> {
        return this.httpClient.get(this.baseUrl.BASE_URL + `Bus/check-license-plate-exists?licensePlate=${licensePlate}`);
      }
      
}