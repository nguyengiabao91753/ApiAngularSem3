import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = localStorage.getItem('userId');
    const levelId = localStorage.getItem('levelId');
    if  (levelId === '1' || levelId === '2') {
      return true
    } else {
           // Các tài khoản khác không được phép truy cập, chuyển hướng về trang login
           this.router.navigate(['/auth/loginAdmin']);
           alert('Bạn không có thẩm quyền truy cập vào khu vực này');
           return false;
    }
  }
}
