import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
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
import { AccountUser } from '../../../entity/accountUser.entity';
import { AccountUserService } from '../../../service/accountUser.service';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-user',
  standalone: true,
  providers: [MessageService,DatePipe],
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
    CalendarModule,
    PasswordModule
  ],
  templateUrl: './passenger.component.html',
})
export class PassengerComponent implements OnInit {
  accountUser: AccountUser = {};
  accountUsers: AccountUser[] = [];
  levelOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Staff', value: 2 },
    { label: 'Passenger', value: 3 },
  ];
  statusOptions = [
    { label: 'InActive', value: 0 },
    { label: 'Active', value: 1 },
  ];
  formGroup!: FormGroup;
  date: Date | undefined;

  //For notications
  accountUserDialog: boolean = false;
  deleteAccountUserDialog: boolean = false;
  deleteAccountUsersDialog: boolean = false;

  //For multi selected
  selectedAccountUsers: AccountUser[] = [];

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(
    private accountUserService: AccountUserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe

  ) {}

  ngOnInit(): void {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const currentUserId = localStorage.getItem('userId');
    const currentLevelId = localStorage.getItem('levelId');
// Nếu không phải admin (levelId != 1), không cho phép truy cập các chức năng thêm, sửa, xóa
    // Nếu là admin, lấy tất cả dữ liệu
    if (currentLevelId === '1') {
      this.accountUserService.GetAllAccountUserInfo().then((res) => {
        this.accountUsers = res as AccountUser[];
      });
    } else if (currentLevelId === '2') {
      // Nếu là nhân viên, chỉ lấy thông tin của chính họ
      this.accountUserService.GetInfoAccountById(Number(currentUserId)).subscribe((res) => {
        if (res) {
          this.accountUsers = [res as AccountUser];
        }
      });
    }


    this.formGroup = this.formBuilder.group({
      userId: '0',
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^0\\d{9}$')]],
      address: ['', [Validators.required, Validators.pattern(/^\d+(\/[\p{L}0-9]+)?\s[\p{L}0-9\s-]{4,100}$/u)]],
      levelId: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });

    this.cols = [
      { field: 'userId', header: 'Id' },
      { field: 'fullName', header: 'Name' },
      { field: 'birthDate', header: 'Birth' },
      { field: 'email', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone' },
      { field: 'address', header: 'Address' },
      { field: 'createdAt', header: 'Created' },
    ];
  }



  //Này là mở hộp thoại thêm mới
  openNew() {
    const currentLevelId = localStorage.getItem('levelId');
    if (currentLevelId !== '1') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Only Admins are allowed to create new accounts.',
        life: 3000,
      });
      return;
    }
    this.accountUser = {};
    this.formGroup.reset(); // Reset form
    this.formGroup.patchValue({ userId: 0 }); // Đặt userId về 0 để đánh dấu là tạo mới
    this.submitted = false;
    this.accountUserDialog = true;
  }

  editAccountUser(accountUser: AccountUser) {
    const currentUserId = localStorage.getItem('userId');
    
    const convertBirthDate = this.chuyenDoiNgay(accountUser.birthDate);
    
    const birthDate = convertBirthDate ? new Date(convertBirthDate) : null;
    console.log('Ngày sinh:', birthDate);
    // if (accountUser.userId.toString() === currentUserId || localStorage.getItem('levelId') === '1') {
      this.formGroup.patchValue({
        userId: accountUser.userId,
        username: accountUser.username,
        password: accountUser.password,
        status: accountUser.status,
        levelId: accountUser.levelId,
        fullName: accountUser.fullName,
        birthDate: birthDate,
        email: accountUser.email,
        phoneNumber: accountUser.phoneNumber,
        address: accountUser.address,
      });
      this.accountUserDialog = true;
    // } else {
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Warning',
    //     detail: 'You can only edit your own information.',
    //     life: 3000,
    //   });
    // }
  }

  chuyenDoiNgay(ngay: string): string {
    // Tách ngày, tháng, năm từ chuỗi vào mảng
    const parts = ngay.split('-');

    // Đảo vị trí của ngày và tháng
    const ngayThangNam = `${parts[1]}-${parts[0]}-${parts[2]}`;

    return ngayThangNam;
}


  deleteAccountUser(accountUser: AccountUser) {
    const currentUserId = localStorage.getItem('userId');
    // Không cho phép xóa tài khoản của chính mình
    if (accountUser.userId.toString() === currentUserId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'You cannot delete your own account.',
        life: 3000,
      });
      return;
    }
    this.deleteAccountUserDialog = true;
    this.accountUser = { ...accountUser };
  }
  confirmDelete() {
    this.deleteAccountUserDialog = false;
    var id = this.accountUser.userId;
    // Xóa ở đây chỉ là gọi hàm xóa với id
    this.accountUserService.DeleteAccountUser(id).then(
      (res) => {
        if (res['status']) {
          this.accountUsers = this.accountUsers.filter(
            (a) => a.userId !== this.accountUser.userId
          );
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

    if (this.formGroup.invalid) {
      return;
    }
  
    const currentLevelId = localStorage.getItem('levelId');
    if (currentLevelId !== '1' && this.formGroup.get('levelId')?.value === 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Employees are not allowed to promote themselves to Admin.',
        life: 3000,
      });
      return;
    }

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
        this.accountUser.birthDate = this.datePipe.transform(
          this.formGroup.get('birthDate')?.value,
          'dd/MM/yyyy');      
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
                    this.formGroup.reset();
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
            console.error('Lỗi từ backend:', error); // In ra lỗi chi tiết
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
        this.accountUser.birthDate = this.datePipe.transform(
          this.formGroup.get('birthDate')?.value,
          'dd/MM/yyyy');      
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
              detail: 'Failed to Update Account',
              life: 3000,
            });
          }
        },
        (error) => {
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
