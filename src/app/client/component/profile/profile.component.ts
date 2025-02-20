import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountUserService } from '../../../service/accountUser.service';
import { AccountUser } from '../../../entity/accountUser.entity';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import * as jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

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
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    console.log('Check token: ' + token);
    if (!token) {
      console.error('Token not found in localStorage.');
      return; // Handle missing token
    }
    // const email = localStorage.getItem('email');
    // if (!email) {
    //   console.error('Email not found in localStorage.');
    //   return; // Handle missing email
    // }

    // Initializing form group with validators
    this.formGroup = this.fb.group({
      username: [{ value: '', disabled: true }],
      fullName: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthDate: ['', Validators.required],
      address: ['', Validators.required],
    });
    // try {
    //   const decodedToken: any = jwtDecode(token);
    //   console.log('Decoded token:', decodedToken);
    //   const userId = decodedToken['nameid']; // Lấy userId từ 'nameid' claim

    //   console.log('Extracted userId:', userId);

    //   if (userId) {
    //     // Fetch user data from backend using userId
    //     this.accountUserService.GetUserProfile().subscribe(
    //       (accountUser: any) => {
    //         if (accountUser) {
    //           this.accountUser = accountUser;

    //           // Set form values from API response
    //           this.formGroup.patchValue({
    //             username: accountUser.username,
    //             fullName: accountUser.fullName,
    //             email: accountUser.email,
    //             phoneNumber: accountUser.phoneNumber,
    //             birthDate: accountUser.birthDate,
    //             address: accountUser.address,
    //           });
    //         }
    //       },
    //       (error) => {
    //         console.error('Error fetching user data', error);
    //       }
    //     );
    //   } else {
    //     console.error('User ID not found in token.');
    //   }
    // } catch (error) {
    //   console.error('Error decoding token:', error);
    // }

    this.accountUserService.GetUserProfile().subscribe(
      (accountUser: any) => {
        if (accountUser) {
          this.accountUser = accountUser;

          // Convert the birthDate from 'dd-MM-yyyy' to Date
          let birthDateString = accountUser.birthDate;
          let birthDateParts = birthDateString.split('-');
          let birthDate = new Date(
            parseInt(birthDateParts[2], 10), // Year
            parseInt(birthDateParts[1], 10) - 1, // Month (0-based)
            parseInt(birthDateParts[0], 10) // Day
          );

          // Format the birthDate to 'yyyy-MM-dd' format for the date input
          const formattedBirthDate = this.datePipe.transform(birthDate, 'yyyy-MM-dd');

          // Set form values from API response
          this.formGroup.patchValue({
            username: accountUser.username,
            fullName: accountUser.fullName,
            email: accountUser.email,
            phoneNumber: accountUser.phoneNumber,
            birthDate: formattedBirthDate,
            address: accountUser.address,
          });
        }
      },
      (error) => {
        console.error('Error fetching user data by email', error);
      }
    );
  
  }

  // ---------------------------------------------
  onSubmit() {
    if (this.formGroup.valid) {
      const updatedData = this.formGroup.getRawValue();
      const formattedBirthDate = this.datePipe.transform(
        updatedData.birthDate,
        'dd-MM-yyyy'
      );

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
  // ---------------------------------------------
}
