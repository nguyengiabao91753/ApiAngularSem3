import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn : 'root'
})

export class PaymentService{

    constructor(
        private httpClient: HttpClient,
        private baseUrl: BaseUrlService
    ){}

    async getAll(){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + 'Payment/get-all-payment'));
    }

    async getById(id: string){
        return lastValueFrom(this.httpClient.get(this.baseUrl.BASE_URL + '/Payment/get-payment-by-id/' + id));
    }
    
}
