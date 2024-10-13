import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    


    if (token && userId) {
      return true; // Đã có token, cho phép truy cập
    } else {
      this.router.navigate(['/auth/loginAdmin']); // Chuyển hướng đến trang đăng nhập admin nếu chưa đăng nhập
      
      return false;
    }
  }
}
