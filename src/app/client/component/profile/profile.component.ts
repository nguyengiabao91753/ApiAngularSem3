import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountUserService } from '../../../service/accountUser.service';
import { AccountUser } from '../../../entity/accountUser.entity';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import * as jwt_decode from 'jwt-decode';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe],

})
export class ProfileComponent implements OnInit {
  formGroup: FormGroup;
  accountUser: AccountUser;

  constructor(
    private fb: FormBuilder,
    private accountUserService: AccountUserService,
    private datePipe: DatePipe

  ){}
  ngOnInit(): void {
    // const userId = Number(localStorage.getItem('userId'));
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('Token not found in localStorage.');
      return; // Handle missing token
    }

    // Initializing form group with validators
    this.formGroup = this.fb.group({
      username: [{ value: '', disabled: true}],  // Username is disabled as it can't be changed
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: ['', Validators.required],
    });
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.nameid; // Assuming ClaimTypes.NameIdentifier is decoded as `nameid`
      console.log('Extracted userId:', userId);

      if (userId) {
        // Fetch user data from backend using userId
        this.accountUserService.GetUserProfile().subscribe(
          (accountUser: any) => {
            if (accountUser) {
              this.accountUser = accountUser;

              // Set form values from API response
              this.formGroup.patchValue({
                username: accountUser.username,
                fullName: accountUser.fullName,
                email: accountUser.email,
                phoneNumber: accountUser.phoneNumber,
                birthDate: accountUser.birthDate,
                address: accountUser.address,
              });
            }
          },
          (error) => {
            console.error('Error fetching user data', error);
          }
        );
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }

    // this.accountUserService.GetInfoAccountById(userId).subscribe(
    //   (accountUser: any) => {
    //     console.log('Dữ liệu nhận được từ API:', accountUser);
    //     if (accountUser) {
    //       this.accountUser = accountUser;
    //       const birthDate = accountUser.birthDate ? new Date(accountUser.birthDate) : null;

    //       this.formGroup.patchValue({
    //         username: accountUser.username,
    //         fullName: accountUser.fullName,
    //         email: accountUser.email,
    //         phoneNumber: accountUser.phoneNumber,
    //         birthDate: accountUser.birthDate.toString("mm/dd/yyyy"),
    //         address: accountUser.address
    //       });
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching user data', error);
    //   }
    // );

    

      
    }
    onSubmit() {
      if (this.formGroup.valid) {
        const updatedData = this.formGroup.getRawValue();
        const formattedBirthDate = this.datePipe.transform(updatedData.birthDate, 'dd-MM-yyyy');
  
        const payload = {
          userId: this.accountUser.userId,
          username: this.accountUser.username,
          fullName: updatedData.fullName,
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          birthDate: formattedBirthDate,
          address: updatedData.address,
          levelId: this.accountUser.levelId,
          status: this.accountUser.status,
        };
  
        this.accountUserService.UpdateAccountUserToken(payload).then(
          (response) => {
            console.log('Server response:', response);
            if (response['status']) {
              alert('Profile updated successfully!');
            } else {
              alert('Failed to update profile.');
            }
          },
          (error) => {
            console.error('Error updating profile', error);
            alert('An error occurred while updating the profile.');
          }
        );
      } else {
        alert('Please fill out the form correctly.');
      }
    }
  }

