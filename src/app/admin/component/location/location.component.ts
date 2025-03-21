import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Location } from '../../../entity/location.entity';
import { LocationService } from '../../../service/locationService';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-location',
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
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  location: Location = {}
  locations: Location[] = []

  formGroup!: FormGroup
  //For notications
  locationDialog: boolean = false
  deleteLocationDialog: boolean = false
  deletelocationDialog: boolean = false

  //For multi selected
  selectedLocations: Location[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private locationService: LocationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.locationService.getAll().then(
      res => {
        this.locations = res as Location[];

      }
    )
    this.formGroup = this.formBuilder.group({
      locationId: '0',
      name: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
        [this.nameExistsValidator.bind(this)] // Validator bất đồng bộ cho name
      ],
    });

    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'status', header: 'Status' },
    ];
  }

  nameExistsValidator(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    return this.locationService.checkLocationName(control.value).pipe(
      map(
        res => {
          return res.exists ? { nameExists: true } : null;
        }
      )
    )
  }
  //Này là mở hộp thoại thêm mới
  openNew() {
    this.location = {};
    this.submitted = false;
    this.formGroup.reset({
      locationId: '0'
    });
    this.locationDialog = true;
  }

  editProduct(location: Location) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      locationId: location.locationId,
      name: location.name,
      status: location.status
    });

    //Mở hộp thoại thêm
    this.locationDialog = true;
  }

  deleteLocation(location: Location) {
    this.location = { ...location };
    this.deleteLocationDialog = true;

  }
  reloadProduct(location: Location) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      locationId: location.locationId,
      name: location.name,
      status: 1
    });

    //Mở hộp thoại thêm
    this.locationDialog = true;
  }
  

  confirmDelete() {
    this.deleteLocationDialog = false; // Đóng hộp thoại xác nhận
    this.location.status = 0;
    console.log(this.location);
    this.locationService.update(this.location).then(
      res => {
        if (res['status']) {

          this.locations = this.locations.filter(a => a.locationId !== this.location.locationId);
          console.log(this.location);

          // this.agegroups = this.agegroups.map(a =>
          //   a.ageGroupId === this.agegroup.ageGroupId ? { ...this.agegroup } : a
          // );

          // this.changeDetectorRef.detectChanges();

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Location Deleted', life: 3000 });
          this.location = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Location', life: 3000 });

      }
    )
  }







  hideDialog() {
    this.locationDialog = false;
    this.submitted = false;
    this.formGroup.reset(
      {
        locationId: '0'
      })
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('locationId').value == 0) {
      // Nếu ID == 0, nghĩa là dữ liệu mới
      this.location = this.formGroup.value as Location;
      this.location.name = this.formGroup.get('name')?.value?.toString();
      this.location.status = 1;
      this.locationService.create(this.location).then(
        res => {
          if (res['status']) {
            this.locationDialog = false;
            this.formGroup.reset();
            this.ngOnInit();

            let newId = this.locations[this.locations.length - 1].locationId + 1;
            this.location.locationId = newId;
            this.locations.push(this.location);
          }
        },
        error => {
          alert("Error");
        }
      );
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.location = this.formGroup.value as Location;
      this.location.name = this.formGroup.get('name')?.value?.toString();
      this.location.status = 1;
      this.locationService.update(this.location).then(
        res => {
          if (res['status']) {
            this.locationDialog = false;
            this.formGroup.reset();
            this.ngOnInit();

            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.locations = this.locations.map(a =>
              a.locationId === this.location.locationId ? { ...this.location } : a
            );
            //{...agegroup} là copy đối tượng đó gắn cho đối tượng đc gắn, [...aaa] là copy mảng
          }
        },
        error => {
          alert("Lỗi");
        }
      );
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
