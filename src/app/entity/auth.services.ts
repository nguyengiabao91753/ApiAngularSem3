import { HttpRequest, HttpEvent, HttpHandler } from "@angular/common/http";
import {  Injectable } from "@angular/core";
import {   ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AuthService{

    constructor(private router: Router){}


    login(userId: string): void {
        localStorage.setItem('userId', userId);
      }
    
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
        if(localStorage.getItem('userId') == null){
            this.router.navigate(['auth/loginAdmin'])
            // alert("Fail to login")
            return false;
        }
        return true;
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }
    
      logout(): void {
        localStorage.removeItem('userId');
        this.router.navigate(['/auth/loginAdmin']);
      }
    
      isLoggedIn(): boolean {
        return !!localStorage.getItem('userId');
      }
}

