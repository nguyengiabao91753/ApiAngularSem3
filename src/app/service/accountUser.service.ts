import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AccountUserService{
    constructor(
        private httpClient: HttpClient,
        private baseurl: BaseUrlService
    ){}

    async CreateAccountUser(accountUser: any){
        console.log('test service create '+ accountUser);

        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'accountUser/createAccountUser', accountUser));
    }
    async GetAllAccountUserInfo(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'accountUser/getAllAccountUserInfo'));
    }
    async UpdateAccountUser(accountUser: any){
        console.log('test service update'+ accountUser);
        return lastValueFrom(this.httpClient.put(this.baseurl.BASE_URL+'accountUser/updateAccountUser', accountUser));
    }
    async DeleteAccountUser(id: number){
        return lastValueFrom(this.httpClient.delete(this.baseurl.BASE_URL+'accountUser/deleteAccountUser/' + id));
    }

    Login(username: string, password: string): Observable<any> {
        console.log("Sending login data:", { username, password }); // Log dữ liệu để kiểm tra
        return this.httpClient.post<any>(`${this.baseurl.BASE_URL}accountUser/login`, { username, password });
    }
    checkUsername(username: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseurl.BASE_URL}accountUser/checkUsername/${username}`);
      }
    async InActive(accountUser: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'accountUser/inActive', accountUser));
    }
    async Active(accountUser:any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'accountUser/active', accountUser));
    }
}