import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userId = localStorage.getItem('userId');
    const levelId = localStorage.getItem('levelId');
    if (userId && (levelId === '1' || levelId === '2')) {
      return true; // Đã đăng nhập
    } else {
      this.router.navigate(['/auth/loginAdmin']); // Chuyển hướng đến trang đăng nhập
      return false; // Không cho phép truy cập
    }
  }
}
