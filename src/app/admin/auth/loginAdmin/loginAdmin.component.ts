import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LayoutService } from '../../../service/applayout.service';
import { AccountUserService } from '../../../service/accountUser.service';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-loginAdmin',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './loginAdmin.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginAdminComponent implements OnInit {
  loginFormGroup: FormGroup;

  constructor(
    public layoutService: LayoutService,
    private accountUserService: AccountUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  login() {
    if (this.loginFormGroup.valid) {
      const loginData = this.loginFormGroup.value;
      console.log('Login data:', loginData); // Kiểm tra dữ liệu từ form

      this.accountUserService
        .Login(loginData.username, loginData.password)
        .subscribe(
          (response) => {
            if (response.token) {
              localStorage.setItem('userId', response.userId);
              localStorage.setItem('email', response.email);
              localStorage.setItem('levelId', response.levelId);
              localStorage.setItem('status', response.status);

              console.log('User ID saved:', localStorage.getItem('userId')); // Kiểm tra userId có được lưu không

              this.router.navigate(['/admin']);

              // Kiểm tra quyền truy cập
              if (response.levelId === 1 || response.levelId === 2) {
                this.router.navigate(['/admin']);
                alert('Login success');
              } else {
           
                alert('Access Denied. You do not have sufficient privileges to access the admin page.');

              }
            } else {
              alert('Login failed: User ID not received');
            }
          },
          (error) => {
            alert('Invalid username or password ' + error);
          }
        );
    } else {
      alert('Please enter valid username and password');
    }
  }
}
