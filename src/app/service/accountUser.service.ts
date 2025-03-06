import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { AccountUser } from "../entity/accountUser.entity";
import { HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, throwError } from 'rxjs';


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
        return lastValueFrom(this.httpClient.post(`${this.baseurl.BASE_URL}accountUser/createAccountUser`, accountUser));
    }
    async CreateAccountUserGg(accountUser: any){
        console.log('test service create '+ accountUser);
        return lastValueFrom(this.httpClient.post(`${this.baseurl.BASE_URL}accountUser/createAccountUserGg`, accountUser));
    }
    async GetAllAccountUserInfo(){
        return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'accountUser/getAllAccountUserInfo'));
    }
    GetInfoAccountById(userId: number): Observable<AccountUser> {
        return this.httpClient.get<AccountUser>(`${this.baseurl.BASE_URL}accountUser/getInfoAccountById/${userId}`);
    }

    UpdateAccountUser(accountUser: any): Promise<any> {
        console.log('test service update', accountUser);
        return lastValueFrom(this.httpClient.put(`${this.baseurl.BASE_URL}accountUser/updateAccountUser`, accountUser));
    }

    UpdatePassword(accountUser: any): Promise<any> {
        console.log('test service update', accountUser);
        return lastValueFrom(this.httpClient.put(`${this.baseurl.BASE_URL}accountUser/updatePassword`, accountUser));
    }
    
    async DeleteAccountUser(id: number){
        return lastValueFrom(this.httpClient.delete(this.baseurl.BASE_URL+'accountUser/deleteAccountUser/' + id));
    }

    Login(username: string, password: string): Observable<any> {
        console.log("Sending login data:", { username, password }); // Log dữ liệu để kiểm tra
        return this.httpClient.post<any>(`${this.baseurl.BASE_URL}accountUser/login`, { username, password });
    }
    loginWithGoogle(idToken: string): Observable<any> {
        return this.httpClient.post<any>(`${this.baseurl.BASE_URL}accountUser/loginWithGoogle`, { idToken });
    }
    checkUsername(username: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseurl.BASE_URL}accountUser/checkUsername/${username}`);
    }
    checkEmail(email: string): Observable<any> {
        return this.httpClient.get<any>(`${this.baseurl.BASE_URL}accountUser/checkEmail/${email}`);
    }
    async InActive(accountUser: any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'accountUser/inActive', accountUser));
    }
    async Active(accountUser:any){
        return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL+'accountUser/active', accountUser));
    }
    GetUserInfoByEmail(email: string): Observable<AccountUser> {
        return this.httpClient.get<AccountUser>(`${this.baseurl.BASE_URL}accountUser/getInfoByEmail/${email}`);
      }
      
    GetUserProfile(): Observable<any> {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            return this.httpClient.get(this.baseurl.BASE_URL + 'accountUser/getInfoByToken', { headers });
        } else {
            console.error('No token found in localStorage');
            return throwError(() => new Error('No token found in localStorage'));
        }
    }
    UpdateAccountUserToken(accountUser: any): Promise<any> {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            return lastValueFrom(
                this.httpClient.put(
                    `${this.baseurl.BASE_URL}accountUser/updateAccountUserToken`,
                    accountUser,
                    { headers }
                )
            );
        } else {
            console.error('No token found in localStorage');
            return Promise.reject('No token found in localStorage');
        }
    }
    
}