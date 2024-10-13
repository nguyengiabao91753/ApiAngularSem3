import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../service/AssetService.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountUserService } from '../../../service/accountUser.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
import * as JSBase64 from 'js-base64'
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  accountUser: any;
  constructor(
    private assetService: AssetService,
    private accountUserService: AccountUserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    // CSS files
    this.assetService.addCss('client/assets/global/css/bootstrap.min.css');
    this.assetService.addCss('client/assets/global/css/all.min.css');
    this.assetService.addCss('client/assets/global/css/line-awesome.min.css');
    this.assetService.addCss('client/assets/templates/basic/css/flaticon.css');
    this.assetService.addCss('client/assets/templates/basic/css/main43a0.css?v3');
    this.assetService.addCss('client/assets/templates/basic/css/custom43a0.css?v3');
    this.assetService.addCss('client/assets/templates/basic/css/colorf972.css?color=0E9E4D');
    this.assetService.addCss('client/assets/global/css/select2.min.css');
    this.assetService.addCss('client/assets/global/css/daterangepicker.css');
    this.assetService.addCss('client/assets/templates/basic/css/slick.css');
    this.assetService.addCss('client/assets/global/css/login.css');
    // JS files
    // this.assetService.addJs('../cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js');
    this.assetService.addJs('client/assets/global/js/jquery-3.7.1.min.js');
    this.assetService.addJs('client/assets/global/js/bootstrap.bundle.min.js');
    this.assetService.addJs('client/assets/templates/basic/js/main43a0.js?v3');
    this.assetService.addJs('client/assets/global/js/select2.min.js');
    this.assetService.addJs('client/assets/global/js/moment.min.js');
    this.assetService.addJs('client/assets/global/js/daterangepicker.min.js');
    this.assetService.addJs('client/assets/templates/basic/js/slick.min.js');
    this.assetService.addCss('client/assets/global/css/iziToast.min.css');
    this.assetService.addCss('client/assets/global/css/iziToast_custom.css');
    this.assetService.addJs('client/assets/global/js/iziToast.min.js');

    this.assetService.setTitle('Login');

    // Validate form
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Thêm script Google Identity
  const googleScript = document.createElement('script');
  googleScript.src = 'https://accounts.google.com/gsi/client';
  googleScript.async = true;
  googleScript.defer = true;
  googleScript.onload = () => {
    google.accounts.id.initialize({
      client_id: '124955703481-vkbv4f5lmbh45ng0l4192igj817o6ff4.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });
    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large' } // Tùy chỉnh nút Google Sign-In
    );
  };
  document.head.appendChild(googleScript);
  }

  handleCredentialResponse(response: any) {
    const googleIdToken = response.credential;
  
    // Gọi dịch vụ để đăng nhập với Google
    this.accountUserService.loginWithGoogle(googleIdToken).subscribe(
      (response: any) => {
        if (response.token) {
          // Lưu token của server vào localStorage
          localStorage.setItem('jwtToken', response.token);
          this.router.navigate(['/profile']);
        } else {
          alert('Login failed: No token received');
        }
      },
      (error) => {
        console.error('Error during login with Google:', error);
        alert('Failed to login with Google.');
      }
    );

// ------------------------------
  //   const token = response.credential;
  //   const decodedToken: any = jwtDecode(token);
  //   const base64URL = token.split(".")[1]
  //   const base64 = base64URL.replace(/-/g,'+').replace(/_/g,'/')
    
  //   JSON.parse(JSBase64.decode(base64))
    
  //   console.log('check base64:',JSON.parse(JSBase64.decode(base64)));

  //     const payLoad =     JSON.parse(JSBase64.decode(base64))
  //     this.accountUser = {
  //       username: payLoad.email,
  //       fullName: payLoad.name,
  //       email: decodedToken.email,
 
  //     }
  //       // Gọi dịch vụ để tạo tài khoản người dùng từ thông tin Google
  // this.accountUserService.CreateAccountUserGg(this.accountUser)
  // .then(response => {
  //   console.log('Account created or retrieved successfully:', response);
  //   // Lưu token vào localStorage và chuyển hướng đến trang profile
  //   localStorage.setItem('jwtToken', token);
  //   localStorage.setItem('email', decodedToken.email);
  //   this.router.navigate(['/profile']);
  // })
  // .catch(error => {
  //   console.error('Error creating account:', error);
  //   alert('Failed to create account: ' + error.message);
  // });
  
}

  login() {
    if (this.loginFormGroup.valid) {
      const loginData = this.loginFormGroup.value;
      console.log('Login data:', loginData); // Kiểm tra dữ liệu từ form

      this.accountUserService
        .Login(loginData.username, loginData.password)
        .subscribe(
          (response: any) => {
            if (response.token) {
              localStorage.setItem('jwtToken', response.token);
              console.log('Token saved:', localStorage.getItem('jwtToken')); // Kiểm tra token có được lưu không
              this.router.navigate(['/profile']);
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
declare global {
  interface Window {
    onGoogleLibraryLoad: () => void;
  }
}
