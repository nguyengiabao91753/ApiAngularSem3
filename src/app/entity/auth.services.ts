import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AuthService{

    constructor(private router: Router){

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
    
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean =>{
    return inject(AuthService).canActivate(next,state)
}