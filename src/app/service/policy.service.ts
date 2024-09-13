import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PolicyService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async create(policy: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'policy/create', policy));
    }
    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'policy/getall'));
    }
    async update(policy: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'policy/update', policy));
    }

}