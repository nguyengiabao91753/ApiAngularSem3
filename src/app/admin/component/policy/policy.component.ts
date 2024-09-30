import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Policy } from '../../../entity/policy.entity';
import { PolicyService } from '../../../service/policy.service';

@Component({
  selector: 'app-policy',
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
    RatingModule
  ],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css'
})
export class PolicyComponent implements OnInit {

  policy: Policy = {}
  policies: Policy[] = []

  formGroup!: FormGroup

  //For notications
  policyDialog: boolean = false
  deletePolicyDialog: boolean = false
  deletePoliciesDialog: boolean = false

  //For multi selected
  selectedPolicies: Policy[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private policyService: PolicyService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.policyService.getAll().then(
      res => {
        this.policies = res as Policy[]
      }
    );

    this.formGroup = this.formBuilder.group({
      policyId: '0',
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'title', header: 'Title' },
      { field: 'content', header: 'Content' },
      { field: 'status', header: 'Status' }
    ];
  }

  openNew() {
    this.policy = {};
    this.submitted = false;
    this.policyDialog = true;
  }

  //Cái này xóa nhiều
  // deleteSelectedProducts() {
  //   this.deletepoliciesDialog = true;
  // }

  editPolicy(policy: Policy) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      policyId: policy.policyId,
      title: policy.title,
      content: policy.content
    });
    //Mở hộp thoại thêm
    this.policyDialog = true;
  }

  deletepolicy(policy: Policy) {
    this.deletePolicyDialog = true;
    this.policy = { ...policy };

  }

  // confirmDeleteSelected() {
  //   this.deletepolicyDialog = false;

  //   this.selectedpolicies.forEach(policy => {
  //     policy.status = 0;
  //     //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
  //     this.policieservice.update(policy).then(
  //       res => {
  //         if (res['status']) {
  //           this.policies = this.policies.filter(val => val.policyId !== policy.policyId);
  //           this.policies = this.policies.map(a =>
  //             a.policyId === this.policy.policyId ? { ...policy } : a
  //           );
  //         }
  //       }
  //     )
  //   });

  //   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'policy Deleted', life: 3000 });
  //   this.deletepolicyDialog = false;
  //   this.selectedpolicies = [];


  // }

  confirmDelete() {
    this.deletePolicyDialog = false;
    this.policy.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log(this.policy);
    this.policyService.update(this.policy).then(
      res => {
        if (res['status']) {

          this.policies = this.policies.filter(a => a.policyId !== this.policy.policyId);
          console.log(this.policy);

          // this.policies = this.policies.map(a =>
          //   a.policyId === this.policy.policyId ? { ...this.policy } : a
          // );

          // this.changeDetectorRef.detectChanges();

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'policy Deleted', life: 3000 });
          this.policy = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete policy', life: 3000 });

      }
    )

  }

  hideDialog() {
    this.policyDialog = false;
    this.submitted = false;
    this.formGroup.reset()
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('policyId').value == 0) {
      //Nếu ID == 0, nghĩa là dữ liệu mới
      this.policy = this.formGroup.value as Policy;

      this.policy.status = 1;
      this.policyService.create(this.policy).then(
        res => {
          if (res['status']) {
            this.policyDialog = false;
            this.formGroup.reset()
            
            //Tăng ID mới lên 1
            let newPolicyId =this.policies[this.policies.length - 1].policyId + 1;

            // Gán policyId cho đối tượng policy
            this.policy.policyId = newPolicyId;
            this.policies.push(this.policy);
          }

        },
        error => {
          alert("Lỗi")
        }
      )
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.policy = this.formGroup.value as Policy;
      this.policy.status = 1;
      this.policyService.update(this.policy).then(
        res => {
          if (res['status']) {
            this.policyDialog = false;
            this.formGroup.reset()

            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.policies = this.policies.map(a =>
              a.policyId === this.policy.policyId ? { ...this.policy } : a
            );
            //{...policy} là copy đối tượng đó gắn cho đối tượng đc gắn, [...aaa] là copy mảng
          }


        },
        error => {
          alert("Lỗi")
        }
      )
    }


  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
