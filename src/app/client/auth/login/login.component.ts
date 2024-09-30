import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../service/AssetService.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountUserService } from '../../../service/accountUser.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink

  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;

  constructor(
    private assetService: AssetService,
    private accountUserService: AccountUserService,
    private router: Router,
    private formBuilder: FormBuilder,


  ){}
  ngOnInit(): void {
      // CSS files
      this.assetService.addCss('client/assets/global/css/bootstrap.min.css');
      this.assetService.addCss('client/assets/global/css/all.min.css');
      this.assetService.addCss('client/assets/global/css/line-awesome.min.css');
      this.assetService.addCss('client/assets/templates/basic/css/flaticon.css');
      
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
  
      this.assetService.setTitle('Bus Booking')


      // Validate form
      this.loginFormGroup = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
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
