import { Injectable } from "@angular/core";
import { HttpClient } from "@microsoft/signalr";
import { BaseUrlService } from "./baseUrl.service";

@Injectable({
    providedIn : 'root'
})

export class PaymentService{
    constructor(
        private httpClient: HttpClient,
        private baseUrl: BaseUrlService
    ){}
}