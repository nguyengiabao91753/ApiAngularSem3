import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class BusSeatService {


    constructor(
        private httpClient: HttpClient,
        private baseUrl: BaseUrlService
    ){}

    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'BusesSeat/get-all-buses-seat'));
    }

    async getSeatsByBusId(id: any){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'BusesSeat/find-seats-by-busId/' + id));
    }

    async countSeatRemaining(id: any){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'BusesSeat/count-seat-remaining/' + id));
    }
}