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
  styleUrl: './headertop.component.css'

})
export class HeadertopComponent implements OnInit{
  isLoggedIn = false; 
  userId: number| null = null;
  userEmail: string | null = null;

  constructor(
    private router: Router
  
  ){}
  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.isLoggedIn = true;
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