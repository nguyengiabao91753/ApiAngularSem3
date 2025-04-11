import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthInterceptor } from '../../../service/authInterceptor';

@Component({
  selector: 'app-headertop',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './headertop.component.html',
  styleUrl: './headertop.component.css'

})
export class HeadertopComponent implements OnInit{
  isLoggedIn = false; 
  userId: number| null = null;
  userEmail: string | null = null;

  constructor(
    private router: Router,
    private auth : AuthInterceptor,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.cdr.detectChanges();
    });
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.userId = Number(localStorage.getItem('userId'));
    
    } else {
      this.isLoggedIn = false;
    }  }

  logout() {
    localStorage.removeItem('jwtToken');      
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    this.isLoggedIn = false;
    this.userEmail = null; // Xóa email khỏi trạng thái
    this.isLoggedIn = false;
    // Điều hướng về trang đăng nhập
    this.router.navigate(['/home']);
  }
}