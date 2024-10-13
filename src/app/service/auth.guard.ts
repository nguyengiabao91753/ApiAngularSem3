import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userId = localStorage.getItem('userId');
    const status = localStorage.getItem('levelId');

    if (userId) {
      return true; // Đã có token, cho phép truy cập
    } else {
      this.router.navigate(['/auth/loginAdmin']); // Chuyển hướng đến trang đăng nhập admin nếu chưa đăng nhập

      return false;
    }
  }
}
