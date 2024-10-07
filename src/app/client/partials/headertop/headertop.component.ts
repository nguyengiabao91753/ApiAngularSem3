import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-headertop',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './headertop.component.html',
})
export class HeadertopComponent implements OnInit{
  isLoggedIn = false; 
  userId: number| null = null;
  levelId: number | null = null;
  status: number | null = null;
  constructor(
    private router: Router
  
  ){}
  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.isLoggedIn = true;
      this.userId = Number(localStorage.getItem('userId'));
      this.levelId = Number(localStorage.getItem('levelId'));
      this.status = Number(localStorage.getItem('status'));
    } else {
      this.isLoggedIn = false;
    }  }

  logout() {
    localStorage.removeItem('jwtToken');      
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('levelId');
    localStorage.removeItem('status');
    this.isLoggedIn = false;
    // Điều hướng về trang đăng nhập
    this.router.navigate(['/home']);
  }
}