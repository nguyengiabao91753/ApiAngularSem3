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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { PasswordModule } from 'primeng/password';
import { BaseUrlService } from '../../../service/baseUrl.service';
// import * as JSBase64 from 'js-base64'
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, RouterLink, CommonModule,
    PasswordModule

  ],
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  accountUser: any;
  constructor(
    private assetService: AssetService,
    private accountUserService: AccountUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private baseUrl: BaseUrlService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
   
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('jwtToken', token);
        this.router.navigate(['/home']);

      }
    });
    if (localStorage.getItem('jwtToken')) {
      this.router.navigate(['/home']);
    }
   

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

    // Thêm script Google Identity
    this.renderGoogleButton();

    // Validate form
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    
  }

  renderGoogleButton() {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts?.id) {
        clearInterval(interval);

        google.accounts.id.initialize({
          client_id: '458933571871-37va24pboj3n54mj2bjsfusg7ifstifj.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large' }
        );
      }
    }, 100); // Kiểm tra mỗi 100ms
  }

  handleCredentialResponse(response: any) {
    const googleIdToken = response.credential;
    console.log('Google ID Token:', googleIdToken);
    
    // Gọi dịch vụ để đăng nhập với Google
    this.accountUserService.loginWithGoogle(googleIdToken).subscribe(
      (response: any) => {
        if (response.token) {
          // Lưu token của server vào localStorage
          localStorage.setItem('jwtToken', response.token);
          console.log('Token saved:', localStorage.getItem('jwtToken'));
          this.router.navigate(['/home']);
          alert('Login success');
          
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error('Error during login with Google:', error);
        alert('Failed to login with Google.');
      }
    );

    

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
              this.router.navigate(['/home']);
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


