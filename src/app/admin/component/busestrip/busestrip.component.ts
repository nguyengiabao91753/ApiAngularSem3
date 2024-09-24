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
import { BusesTrip } from '../../../entity/bustrip.entity';
import { BusesTripService } from '../../../service/busestrip.service';

@Component({
  selector: 'app-busestrip',
  standalone: true,
  providers:[MessageService],
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
  templateUrl: './busestrip.component.html',
  styleUrl: './busestrip.component.css'
})
export class BusestripComponent implements OnInit {

  busestrip: BusesTrip = {}
  busestrips: BusesTrip[] = []
  originBusTripList : BusesTrip[] = []

  formGroup!: FormGroup

  //For notications
  bustripDialog: boolean = false
  deleteBusTripDialog: boolean = false
  deleteBusTripsDialog: boolean = false

  //For multi selected
  selectedBusTrips: BusesTrip[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private busestripService: BusesTripService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.busestripService.getAll().then(
      res => {
        this.busestrips = res as BusesTrip[];

      }
    );
    this.busestripService.getAll().then(
      res => {
        this.originBusTripList = res as BusesTrip[];

      }
    );
    
    this.formGroup = this.formBuilder.group({
      busTripId: '0',
      busId: ['', [Validators.required]],
      tripId: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'discount', header: 'Discount' },
      { field: 'status', header: 'Status' }
    ];

  }

  //Này là mở hộp thoại thêm mới
  openNew() {
    this.busestrip = {};
    this.submitted = false;
    this.bustripDialog = true;
  }

  //Cái này xóa nhiều
  deleteSelectedBusesTrips() {
    this.deleteBusTripDialog = true;
  }

  editBusTrip(bustrip: BusesTrip) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      ageGroupId: bustrip.busTripId,
      
    });
    //Mở hộp thoại thêm
    this.bustripDialog = true;
  }

  deleteBusTrip(bustrip: BusesTrip) {
    this.deleteBusTripDialog = true;
    this.busestrip = { ...bustrip };

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
    this.deleteBusTripDialog = false;
    this.busestrip.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log(this.busestrip);
    this.busestripService.update(this.busestrip).then(
      res => {
        if (res['status']) {

          this.busestrips = this.busestrips.filter(a => a.busTripId !== this.busestrip.busTripId);
          console.log(this.busestrip);
          
          // this.agegroups = this.agegroups.map(a =>
          //   a.ageGroupId === this.agegroup.ageGroupId ? { ...this.agegroup } : a
          // );
          
          // this.changeDetectorRef.detectChanges();

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'AgeGroup Deleted', life: 3000 });
          this.busestrip = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete AgeGroup', life: 3000 });

      }
    )
    
  }

  hideDialog() {
    this.bustripDialog = false;
    this.submitted = false;
    this.formGroup.reset()
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('ageGroupId').value == 0) {
      //Nếu ID == 0, nghĩa là dữ liệu mới
      this.busestrip = this.formGroup.value as BusesTrip;
      
      this.busestripService.create(this.busestrip).then(
        res => {
          if (res['status']) {
            this.bustripDialog = false;
            this.formGroup.reset()

            let newId = this.originBusTripList[this.originBusTripList.length-1].busTripId + 1;
            this.busestrip.busTripId = newId;
            this.busestrips.push(this.busestrip);
          }

        },
        error => {
          alert("Lỗi")
        }
      )
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.busestrip = this.formGroup.value as BusesTrip;
      
      this.busestripService.update(this.busestrip).then(
        res => {
          if (res['status']) {
            this.bustripDialog = false;
            this.formGroup.reset()

            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.busestrips = this.busestrips.map(a =>
              a.busTripId === this.busestrip.busTripId ? { ...this.busestrip } : a
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
