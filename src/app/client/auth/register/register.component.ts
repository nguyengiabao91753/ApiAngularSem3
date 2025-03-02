import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../service/AssetService.service';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { CommonModule, DatePipe, NgStyle } from '@angular/common';
import { AccountUserService } from '../../../service/accountUser.service';
import { AccountUser } from '../../../entity/accountUser.entity';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    RouterLink,
    PasswordModule,
    NgStyle,
    FormsModule, // Add this
    ReactiveFormsModule, // And this for reactive forms
    CommonModule
  ],
    providers: [DatePipe]
  
})
export class RegisterComponent implements OnInit {
  accountUser: AccountUser = {};
  formGroup!: FormGroup;
  // Declare the missing properties
  username: string = '';
  password: string = '';
  fullName: string = '';
  birthDate: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  constructor(
    private assetService: AssetService,
    private accountUserService: AccountUserService,
    private router: Router,
    private formBuilder: FormBuilder, // Inject FormBuilder to build form
    private datePipe: DatePipe

  ) 

  {}
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
    this.assetService.addCss('client/assets/global/css/register.css');

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

    this.assetService.setTitle('Register');

    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^0\\d{9}$')]],
      address: ['', Validators.required],
      confirmPassword:['', Validators.required]
    });

  }
  register() {
    if (this.formGroup.valid) {
      const rawBirthDate = this.formGroup.get('birthDate')?.value;
      const formattedBirthDate = this.datePipe.transform(rawBirthDate, 'dd/MM/yyyy'); // Hoặc định dạng mà server yêu cầu
  
      const accountUser = {
        
        username: this.formGroup.get('username')?.value?.toString(),
        password: this.formGroup.get('password')?.value?.toString(),
        status: 1, // Set status to 1 for a new customer
        levelId: 3, // Set levelId to 3 (assuming 3 is the level for a customer)
        fullName: this.formGroup.get('fullName')?.value?.toString(),
        // birthDate: this.formGroup.get('birthDate')?.value?.toString(),
        birthDate: formattedBirthDate,

        
        email: this.formGroup.get('email')?.value?.toString(),
        phoneNumber: this.formGroup.get('phoneNumber')?.value?.toString(),
        address: this.formGroup.get('address')?.value?.toString(),
      };
      
      this.accountUserService
        .checkUsername(accountUser.username)
        .subscribe((res) => {
          if (res.exists) {
            alert('Username already exists');
          } else {
            this.accountUserService.CreateAccountUser(accountUser).then(
              (res) => {
                if (res['status']) {
                  alert('Account Created Successfully');
                  
                  this.router.navigate(['/login']);
                } else {
                  alert('Failed to Create Account');
                }
              },
              (error) => {
                alert('Error creating account: ' + error);
              }
            );
          }
        });
    } else {
      alert('Please fill all required fields.');
    }
  }
}  