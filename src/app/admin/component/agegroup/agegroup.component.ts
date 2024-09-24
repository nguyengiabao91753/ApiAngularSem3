import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { AgeGroup } from '../../../entity/agegroup.entity';
import { AgeGroupService } from '../../../service/agegroup.service';

@Component({
  selector: 'app-agegroup',
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
  templateUrl: './agegroup.component.html',
  styleUrl: './agegroup.component.css'
})
export class AgegroupComponent implements OnInit {
  agegroup: AgeGroup = {}
  agegroups: AgeGroup[] = []
  originAgeList : AgeGroup[] = []

  formGroup!: FormGroup

  //For notications
  agegroupDialog: boolean = false
  deleteAgeGroupDialog: boolean = false
  deleteAgeGroupsDialog: boolean = false

  //For multi selected
  selectedAgeGroups: AgeGroup[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private ageGroupService: AgeGroupService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.ageGroupService.getAll().then(
      res => {
        this.agegroups = res as AgeGroup[];

      }
    );
    this.ageGroupService.getAll().then(
      res => {
        this.originAgeList = res as AgeGroup[];

      }
    );
    
    this.formGroup = this.formBuilder.group({
      ageGroupId: '0',
      name: ['', [Validators.required]],
      discount: ['', [Validators.required]],
    });

    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'discount', header: 'Discount' },
      { field: 'status', header: 'Status' }
    ];

  }

  //Này là mở hộp thoại thêm mới
  openNew() {
    this.agegroup = {};
    this.submitted = false;
    this.agegroupDialog = true;
  }

  //Cái này xóa nhiều
  deleteSelectedAgeGroups() {
    this.deleteAgeGroupsDialog = true;
  }

  editProduct(agegroup: AgeGroup) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      ageGroupId: agegroup.ageGroupId,
      name: agegroup.name,
      discount: agegroup.discount
    });
    //Mở hộp thoại thêm
    this.agegroupDialog = true;
  }

  deleteAgeGroup(agegroup: AgeGroup) {
    this.deleteAgeGroupDialog = true;
    this.agegroup = { ...agegroup };

  }

  // confirmDeleteSelected() {
  //   this.deleteAgeGroupDialog = false;

  //   this.selectedAgeGroups.forEach(agegroup => {
  //     agegroup.status = 0;
  //     //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
  //     this.ageGroupService.update(agegroup).then(
  //       res => {
  //         if (res['status']) {
  //           this.agegroups = this.agegroups.filter(val => val.ageGroupId !== agegroup.ageGroupId);
  //           this.agegroups = this.agegroups.map(a =>
  //             a.ageGroupId === this.agegroup.ageGroupId ? { ...agegroup } : a
  //           );
  //           this.selectedAgeGroups = this.selectedAgeGroups.filter(val => val.ageGroupId !== agegroup.ageGroupId)
  //         }
  //       }
  //     )
  //   });

  //   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'AgeGroup Deleted', life: 3000 });
  //   this.deleteAgeGroupDialog = false;
  //   //this.selectedAgeGroups = [];


  // }

  confirmDelete() {
    this.deleteAgeGroupDialog = false;
    this.agegroup.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log(this.agegroup);
    this.ageGroupService.update(this.agegroup).then(
      res => {
        if (res['status']) {

          this.agegroups = this.agegroups.filter(a => a.ageGroupId !== this.agegroup.ageGroupId);
          console.log(this.agegroup);
          
          // this.agegroups = this.agegroups.map(a =>
          //   a.ageGroupId === this.agegroup.ageGroupId ? { ...this.agegroup } : a
          // );
          
          // this.changeDetectorRef.detectChanges();

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'AgeGroup Deleted', life: 3000 });
          this.agegroup = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete AgeGroup', life: 3000 });

      }
    )
    
  }

  hideDialog() {
    this.agegroupDialog = false;
    this.submitted = false;
    this.formGroup.reset()
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('ageGroupId').value == 0) {
      //Nếu ID == 0, nghĩa là dữ liệu mới
      this.agegroup = this.formGroup.value as AgeGroup;
      this.agegroup.discount = this.formGroup.get('discount')?.value?.toString();
      this.agegroup.status = 1;
      this.ageGroupService.create(this.agegroup).then(
        res => {
          if (res['status']) {
            this.agegroupDialog = false;
            this.formGroup.reset()

            let newId = this.originAgeList[this.originAgeList.length-1].ageGroupId + 1;
            this.agegroup.ageGroupId = newId;
            this.agegroups.push(this.agegroup);
          }

        },
        error => {
          alert("Lỗi")
        }
      )
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.agegroup = this.formGroup.value as AgeGroup;
      this.agegroup.discount = this.formGroup.get('discount')?.value?.toString();
      this.agegroup.status = 1;
      this.ageGroupService.update(this.agegroup).then(
        res => {
          if (res['status']) {
            this.agegroupDialog = false;
            this.formGroup.reset()

            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.agegroups = this.agegroups.map(a =>
              a.ageGroupId === this.agegroup.ageGroupId ? { ...this.agegroup } : a
            );
            //{...agegroup} là copy đối tượng đó gắn cho đối tượng đc gắn, [...aaa] là copy mảng
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
