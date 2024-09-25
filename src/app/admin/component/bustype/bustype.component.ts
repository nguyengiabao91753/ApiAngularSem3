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
import { BusType } from '../../../entity/bustype.entity';
import { BusTypeService } from '../../../service/bustype.service';

@Component({
  selector: 'app-bustype',
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
  templateUrl: './bustype.component.html',
  styleUrl: './bustype.component.css'
})
export class BusTypeComponent implements OnInit {
  bustype: BusType = {}
  bustypes: BusType[] = []

  formGroup!: FormGroup

  //For notications
  busTypeDialog: boolean = false
  deleteBusTypeDialog: boolean = false
  deleteBusTypesDialog: boolean = false

  //For multi selected
  selectedBusTypes: BusType[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private busTypeService: BusTypeService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    this.busTypeService.getAll().then(
      res => {
        this.bustypes = res as BusType[];
      }
    )
    this.formGroup = this.formBuilder.group({
      busTypeId: 0,
      name: ['', [Validators.required]]
    });

    this.cols = [
      { field: 'busTypeId', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'status', header: 'Status' }
    ];

  }

  openNew() {
    this.bustype = {};
    this.submitted = false;
    this.busTypeDialog = true;
  }

  editBusType(busType: BusType){
    this.formGroup.patchValue({
        busTypeId: busType.busTypeId,
        name: busType.name
    }),

    this.busTypeDialog = true;
  }

  deleteBusType(busType: BusType){
    this.deleteBusTypeDialog = true;
    this.bustype = {...busType};
  }

  confirmDelete() {
    this.deleteBusTypeDialog = false;
    this.bustype.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log('Deleting Bus Type:', this.bustype);
    this.busTypeService.update(this.bustype).then(
      res => {
        if (res['status']) {
          this.bustypes = this.bustypes.filter(a => a.busTypeId !== this.bustype.busTypeId);
          console.log(this.bustype);

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Bus Type Deleted', life: 3000 });
          this.bustype = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Bus Type', life: 3000 });
      }
    )
    
  }

  hideDialog() {
    this.busTypeDialog = false;
    this.submitted = false;
    this.formGroup.reset()
  }

  save(){
    this.submitted = true;
    if(this.formGroup.get('busTypeId').value == 0){
      this.bustype = this.formGroup.value as BusType
      this.bustype.name = this.formGroup.get('name')?.value?.toString();
      this.bustype.status = 1;
      this.busTypeService.create(this.bustype).then(
        res => {
          if(res['status']){
            this.busTypeDialog = false;
            this.formGroup.reset();
            this.bustypes.push(this.bustype);
          }
        },
        error => {
          alert('Error');
        }
      )
    }else{
      this.bustype = this.formGroup.value as BusType;
      this.bustype.name = this.formGroup.get('name')?.value?.toString();
      this.bustype.status = 1;
      this.busTypeService.update(this.bustype).then(
        res => {
          if(res['status']){
            this.busTypeDialog = false;
            this.formGroup.reset();
            
            this.bustypes = this.bustypes.map(
              b => b.busTypeId === this.bustype.busTypeId ? {...this.bustype} : b
            );
          }
        },
        error => {
          alert('Error');
        }
      )
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}