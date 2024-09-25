import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { last, lastValueFrom } from "rxjs";
import { BusType } from "../entity/bustype.entity";

@Injectable({
    providedIn:'root'
})
export class BusTypeService{
    constructor(
        private httpClient: HttpClient,
        private baseUrl: BaseUrlService
    ){}

    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'BusType/get-all-bus-type'));
    }

    async update(busType: any){
        return lastValueFrom(this.httpClient.post(this.baseUrl.BASE_URL + 'BusType/update-bus-type', busType));
    }

    async create(busType: any){
        return lastValueFrom(this.httpClient.post(this.baseUrl.BASE_URL + 'BusType/create-bus-type', busType));
    }

    async delete(id: number){
        return lastValueFrom(this.httpClient.post(this.baseUrl.BASE_URL + 'BusType/disable-bus-type', id));
    }
}