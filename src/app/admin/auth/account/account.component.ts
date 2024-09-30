import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { AccountUser } from '../../../entity/accountUser.entity';
import { AccountUserService } from '../../../service/accountUser.service';

@Component({
  selector: 'app-account',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    RatingModule,
  ],
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  accountUser: AccountUser = {};
  accountUsers: AccountUser[] = [];
  levelOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Employee', value: 2 },
    { label: 'Passenger', value: 3 },
  ];
  statusOptions = [
    { label: 'InActive', value: 0 },
    { label: 'Active', value: 1 },
    { label: 'OnDuty', value: 2 },
  ];
  formGroup!: FormGroup;
  passwordFormGroup!: FormGroup;

  //For notications
  accountUserDialog: boolean = false;
  deleteAccountUserDialog: boolean = false;
  deleteAccountUsersDialog: boolean = false;


  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(
    private accountUserService: AccountUserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.accountUserService.GetAllAccountUserInfo().then((res) => {
      this.accountUsers = res as AccountUser[];
    });
    this.formGroup = this.formBuilder.group({
      userId: '0',
      username: ['', [Validators.required]],
      password: '',
      fullName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      levelId: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    this.passwordFormGroup = this.formBuilder.group(
      {
        Password: ['', [Validators.required, Validators.minLength(6)]],
        ConfirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );

    this.cols = [
      { field: 'userId', header: 'Id' },
      { field: 'username', header: 'Username' },
      { field: 'password', header: 'Password' },
      { field: 'status', header: 'Status' },
      { field: 'levelId', header: 'Level' },
    ];
  }
  //Này là mở hộp thoại thêm mới
  openNew() {
    this.accountUser = {};
    this.formGroup.reset(); // Reset form
    this.formGroup.patchValue({ userId: 0 }); // Đặt userId về 0 để đánh dấu là tạo mới
    this.submitted = false;
    this.accountUserDialog = true;
  }
  editAccountUser(accountUser: AccountUser) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      userId: accountUser.userId,
      username: accountUser.username,
      password: '',

      status: accountUser.status,
      levelId: accountUser.levelId,

      fullName: accountUser.fullName,
      birthDate: accountUser.birthDate,
      email: accountUser.email,
      phoneNumber: accountUser.phoneNumber,
      address: accountUser.address,
    });
    //Mở hộp thoại thêm
    this.accountUserDialog = true;
  }
  visible: boolean = false;
  //Mở hộp thoại đổi password
  showDialogPassword() {
    this.visible = true;
  }
  // Opens the dialog with the current user's information
  changePassword(accountUser: AccountUser) {
    this.passwordFormGroup.reset(); // Reset the form to clear previous inputs
    this.accountUser = { ...accountUser }; // Set the selected user for which to change the password
    this.visible = true; // Show the password change dialog
  }
  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('Password')?.value ===
      formGroup.get('ConfirmPassword')?.value
      ? null
      : { mismatch: true };
  }
  // Handles saving the new password
  savePassword() {
    if (this.passwordFormGroup.valid) {
      const newPassword = this.passwordFormGroup.get('Password')?.value;

      // You can add your logic to update the password, such as calling a service to update the password
      this.accountUser.password = newPassword; // Set the new password

      // Call your service to update the user's password
      this.accountUserService.UpdateAccountUser(this.accountUser).then(
        (res) => {
          if (res['status']) {
            this.visible = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Password Updated Successfully',
              life: 3000,
            });
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
  }


  deleteAccountUser(accountUser: AccountUser) {
    this.deleteAccountUserDialog = true;
    this.accountUser = { ...accountUser };
  }

  confirmDelete() {
    this.deleteAccountUserDialog = false;
    this.accountUser.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log(this.accountUser);
    this.accountUserService.InActive(this.accountUser).then(
      (res) => {
        if (res['status']) {
          this.accountUsers = this.accountUsers.filter(
            (a) => a.userId !== this.accountUser.userId
          );
          console.log(this.accountUser);

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Account Deleted',
            life: 3000,
          });
          this.accountUser = {};
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete Account ' + error,
          life: 3000,
        });
      }
    );
  }

  hideDialog() {
    this.accountUserDialog = false;
    this.submitted = false;
    this.formGroup.reset();
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('userId').value == 0) {
      // Nếu ID == 0, nghĩa là dữ liệu mới
      this.accountUser = this.formGroup.value as AccountUser;
      this.accountUser.username = this.formGroup
        .get('username')
        ?.value?.toString();
      this.accountUser.password = this.formGroup
        .get('password')
        ?.value?.toString();
      this.accountUser.status = this.formGroup.get('status')?.value;
      this.accountUser.levelId = this.formGroup.get('levelId')?.value;
      this.accountUser.fullName = this.formGroup
        .get('fullName')
        ?.value?.toString();
      this.accountUser.birthDate = this.formGroup
        .get('birthDate')
        ?.value?.toString();
      this.accountUser.phoneNumber = this.formGroup
        .get('phoneNumber')
        ?.value?.toString();
      this.accountUser.address = this.formGroup
        .get('address')
        ?.value?.toString();

      this.accountUserService
        .checkUsername(this.accountUser.username)
        .subscribe(
          (res) => {
            if (res.exists) {
              alert('Username đã tồn tại');
            } else {
              this.accountUserService.CreateAccountUser(this.accountUser).then(
                (res) => {
                  if (res['status']) {
                    this.accountUserDialog = false;
                    this.formGroup.reset();

                    let newId =
                      this.accountUsers[this.accountUsers.length - 1].userId +
                      1;
                    this.accountUser.userId = newId;
                    this.accountUsers.push(this.accountUser);
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Successful',
                      detail: 'Account Created Successfully',
                      life: 3000,
                    });
                    this.loadData();
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Failed to Create Account',
                      life: 3000,
                    });
                  }
                },
                (error) => {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Username is already exist ' + error,
                    life: 3000,
                  });
                }
              );
            }
          },
          (error) => {
            console.error('Lỗi khi kiểm tra username', error);
            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: 'Error during updated ' + error.message,
              life: 3000,
            });
          }
        );
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.accountUser = this.formGroup.value as AccountUser;
      this.accountUser.username = this.formGroup
        .get('username')
        ?.value?.toString();
      if (!this.formGroup.get('password').value) {
        this.accountUser.password = null; // Không gửi mật khẩu mới nếu không thay đổi
      }
      this.accountUser.status = this.formGroup.get('status')?.value;
      this.accountUser.levelId = this.formGroup.get('levelId')?.value;
      this.accountUser.fullName = this.formGroup
        .get('fullName')
        ?.value?.toString();
      this.accountUser.birthDate = this.formGroup
        .get('birthDate')
        ?.value?.toString();
      this.accountUser.phoneNumber = this.formGroup
        .get('phoneNumber')
        ?.value?.toString();
      this.accountUser.address = this.formGroup
        .get('address')
        ?.value?.toString();
      console.log('Cập nhật account:', this.accountUser);

      this.accountUserService.UpdateAccountUser(this.accountUser).then(
        (res) => {
          if (res['status']) {
            this.accountUserDialog = false;
            this.formGroup.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Account Updated Successfully',
              life: 3000,
            });
            this.loadData();
            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.accountUsers = this.accountUsers.map((a) =>
              a.userId === this.accountUser.userId ? { ...this.accountUser } : a
            );
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed To Update Account',
              life: 3000,
            });
          }
        },
        (error) => {
          console.error('Lỗi từ backend:', error); // In ra lỗi chi tiết
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error during updated ' + error.message,
            life: 3000,
          });
        }
      );
    }
  }
  loadData() {
    this.accountUserService.GetAllAccountUserInfo().then((response) => {
      this.accountUsers = response as AccountUser[];
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
