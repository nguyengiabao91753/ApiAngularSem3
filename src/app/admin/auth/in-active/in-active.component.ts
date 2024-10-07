import { Component, OnInit } from '@angular/core';
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
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-in-active',
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
  templateUrl: './in-active.component.html',
})
export class InActiveComponent implements OnInit {
  accountUser: AccountUser = {};
  accountUsers: AccountUser[] = [];
    //For Table
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    constructor(
      private accountUserService: AccountUserService,
      private messageService: MessageService,
      private formBuilder: FormBuilder
    ) {}
      //For notications
  accountUserDialog: boolean = false;
  activeAccountUserDialog: boolean = false;
  activeAccountUsersDialog: boolean = false;
  deleteAccountUserDialog: boolean = false;
  deleteAccountUsersDialog: boolean = false;
  ngOnInit(): void {
    this.accountUserService.GetAllAccountUserInfo().then((res) => {
      this.accountUsers = res as AccountUser[];
    });
    this.cols = [
      { field: 'userId', header: 'Id' },
      { field: 'username', header: 'Username' },
      { field: 'password', header: 'Password' },
      { field: 'levelId', header: 'Level' },
      { field: 'fullName', header: 'Name' },
      { field: 'birthDate', header: 'Birth' },
      { field: 'email', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone' },
      { field: 'address', header: 'Address' },

      
    ];
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  activeAccountUser(accountUser: AccountUser) {
    this.activeAccountUserDialog = true;
    this.accountUser = { ...accountUser };
  }
  confirmActiveAccount(){
    this.activeAccountUserDialog = false;
    this.accountUser.status = 1;
    console.log(this.accountUser);
    this.accountUserService.Active(this.accountUser).then(
      (res) => {
        if (res['status']) {
          this.accountUsers = this.accountUsers.filter(
            (a) => a.userId !== this.accountUser.userId
          );
          console.log(this.accountUser);

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Account Activated',
            life: 3000,
          });
          this.accountUser = {};
        }
      //   if (res['status']) {
      //     const index = this.accountUsers.findIndex(a => a.userId === this.accountUser.userId);
      //     if (index !== -1) {
      //         this.accountUsers[index].status = 1;
      //     }
      //     this.messageService.add({
      //         severity: 'success',
      //         summary: 'Successful',
      //         detail: 'Account Activated',
      //         life: 3000,
      //     });
      //     this.accountUser = {};
      // }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to active Account ' + error,
          life: 3000,
        });
      }
    );
  }
  deleteAccountUser(accountUser: AccountUser) {
    this.deleteAccountUserDialog = true;
    this.accountUser = { ...accountUser };
  }
  confirmDelete() {
    this.deleteAccountUserDialog = false;
    this.accountUser.status = 0;
    var id = this.accountUser.userId;

    console.log(this.accountUser);
    this.accountUserService.DeleteAccountUser(id).then(
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
}
