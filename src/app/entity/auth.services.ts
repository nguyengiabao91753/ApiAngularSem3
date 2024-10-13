import {  Injectable } from "@angular/core";
import {   Router } from "@angular/router";

@Injectable({
    providedIn:'root'
})
export class AuthService{

    constructor(private router: Router){}


    login(userId: string): void {
        localStorage.setItem('userId', userId);
      }
    
      logout(): void {
        localStorage.removeItem('userId');
        this.router.navigate(['/auth/loginAdmin']);
      }
    
      isLoggedIn(): boolean {
        return !!localStorage.getItem('userId');
      }
}

