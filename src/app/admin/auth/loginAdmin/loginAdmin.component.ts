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
    RippleModule
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
              localStorage.setItem('jwtToken', response.token);
              localStorage.setItem('userId', response.userId);
              localStorage.setItem('email', response.email);
              localStorage.setItem('levelId', response.levelId);
              localStorage.setItem('status', response.status);

              console.log('Token saved:', localStorage.getItem('jwtToken')); // Kiểm tra token có được lưu không
              this.router.navigate(['/admin']);

              // // Redirect based on status
              // if (response.levelId == 1) {
              //   this.router.navigate(['/admin/']);
              // } else if (response.levelId == 2) {
              //   this.router.navigate(['/admin/ambulance']);
              // } else if (response.levelId == 3) {
              //   this.router.navigate(['/admin/assign-driver']); // Redirect drivers to request page
              // }

              alert('Login success');
            } else {
              alert('Login failed: No token received');
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
