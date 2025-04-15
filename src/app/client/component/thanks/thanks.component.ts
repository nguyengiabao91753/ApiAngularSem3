import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.css'
})
export class ThanksComponent implements OnInit {
  isLoggedIn = false;

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if(token) {
      this.isLoggedIn = true;
    }
  }
}
