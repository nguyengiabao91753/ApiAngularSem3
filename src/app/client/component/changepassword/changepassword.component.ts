import { Component, OnInit } from '@angular/core';
import { AccountUserService } from '../../../service/accountUser.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountUser } from '../../../entity/accountUser.entity';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent implements OnInit {
 
  passwordFormGroup!: FormGroup;
  accountUser: AccountUser = {};
  current = false;
  constructor(
    private accountUserService: AccountUserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router

  ) {}

  ngOnInit(): void {

    this.accountUserService.GetUserProfile().subscribe(
      (accountUser: any) => {
        if (accountUser) {
          this.accountUser = accountUser;
        }
      },
      (error) => {
        console.error('Error fetching user data by email', error);
      }
    );

      this.passwordFormGroup = this.formBuilder.group(
        {
          CurrentPassword: ['', [Validators.required]],
          password: ['', Validators.required,   Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)],
          ConfirmPassword: ['', [Validators.required]],
        },
        { validator: this.passwordMatchValidator }
      );
  
      
    }
  passwordMatchValidator(formGroup: FormGroup) {

      return formGroup.get('Password')?.value ===
        formGroup.get('ConfirmPassword')?.value
        ? null
        : { mismatch: true };
  }
    // Handles saving the new password
    savePassword() {
      this.accountUserService.Login(this.accountUser.username, this.passwordFormGroup.get('CurrentPassword')?.value).subscribe(
        (response: any) => {
          if (response.token) {
            if (this.passwordFormGroup.valid) {
              const newPassword = this.passwordFormGroup.get('Password')?.value;
        
              this.accountUser.password = newPassword;
             
              this.accountUserService.UpdatePassword(this.accountUser).then(
                (res) => {
                  if (res['status']) {
                   
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Password Updated Successfully',
                      life: 3000,
                    });

                    this.logout();
                    

                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Failed To Update Password',
                      life: 3000,
                    });
                  }
                },
                (error) => {
                  console.error('Error updating password:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error updating password',
                    life: 3000,
                  });
                }
              );
            }

          } else {
            alert('Change Password false!');
          }
        },
        (error) => {
          alert('Current Password is InValid');
        }
      );
     
    }

    logout() {
      localStorage.removeItem('jwtToken');      
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      // Điều hướng về trang đăng nhập
      this.router.navigate(['/login']);
    }
}
