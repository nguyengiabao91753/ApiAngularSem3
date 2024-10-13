import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BusesTripService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async create(busestrip: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'busestrip/create', busestrip));
    }

    async update(busestrip: any){
        return lastValueFrom(this.httpClient.put(this.baseurl.BASE_URL+'busestrip/update', busestrip));
    }

    async getById(id: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'busestrip/getbyid', id));
    }

    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'busestrip/getall'));
    }

    async getAllActive(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'busestrip/getallactive'));
    }
}