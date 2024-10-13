// role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredLevelIds: number[] = route.data['requiredLevelIds'];

    const levelIdString = localStorage.getItem('levelId');
    const levelId = levelIdString ? parseInt(levelIdString, 10) : null;

    if (levelId && requiredLevelIds.includes(levelId)) {
      return true;
    } else {
      // Chuyển hướng đến trang không có quyền truy cập hoặc trang đăng nhập
      this.router.navigate(['/auth/loginAdmin']);
      return false;
    }
  }
}
