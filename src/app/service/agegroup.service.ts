import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AgeGroupService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async create(agegroup: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'agegroup/create', agegroup));
    }
    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'agegroup/getall'));
    }
    async update(agegroup: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'agegroup/update', agegroup));
    }
    async delete(id: number){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'agegroup/delete', id));
    }
}