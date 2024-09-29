import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

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
}