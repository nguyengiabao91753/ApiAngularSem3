import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocationService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async create(location: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'location/create', location));
    }
    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'location/getall'));
    }
    async update(location: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'location/update', location));
    }
    async delete(id: number){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'location/delete', id));
    }
    checkLocationName(name : string): Observable<any>
    {
        return this.httpClient.get(this.baseurl.BASE_URL + `location/check-location-name-exists?name=${name}`);
    }
}