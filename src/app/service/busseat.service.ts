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

    async getSeatsByBusId(id: string){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'BusesSeat/find-seats-by-busId/' + id));
    }
}