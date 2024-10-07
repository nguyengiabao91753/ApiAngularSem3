import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../service/applayout.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports:[
      CommonModule,
      RouterLink
    ],
    templateUrl: './topbar.component.html'
})
export class TopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
      public layoutService: LayoutService,
      private router: Router
      
    ) { }
  ngOnInit(): void {
  }

  
    // Hàm đăng xuất
    logout() {
      localStorage.removeItem('jwtToken');      
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('levelId');
      localStorage.removeItem('status');
  
      // Điều hướng về trang đăng nhập
      this.router.navigate(['/auth/loginAdmin']);
    }
}
