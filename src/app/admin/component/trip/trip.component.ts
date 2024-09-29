import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Trip } from '../../../entity/trip.entity';
import { Location } from '../../../entity/location.entity';
import { TripService } from '../../../service/trip.service';
import { LocationService } from '../../../service/locationService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trip',
  standalone: true,
  providers: [MessageService, DatePipe],
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
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css',
})
export class TripComponent implements OnInit {
  trip: Trip = {}
  trips: Trip[] = []
  location: Location = {}
  locations: Location[] = []

  formGroup!: FormGroup

  //For notications
  tripDialog: boolean = false
  deleteTripDialog: boolean = false
  deleteTripsDialog: boolean = false

  //For multi selected
  selectedTrips: Trip[] = []
  selectedLocation: Location[] = []

  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  dateEndSelected: boolean = false; // Biến điều khiển

  constructor(
    private tripService: TripService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.tripService.getAll().then(
      res => {
        this.trips = res as Trip[];
        console.log(this.trips);
      }
    )
    this.locationService.getAll().then(
      res => {
        this.locations = res as Location[];
        console.log(this.locations);
      }
    )
    this.formGroup = this.formBuilder.group({
      tripId: '0',
      departureLocationId: ['', [Validators.required]],
      arrivalLocationId: ['', [Validators.required]],
      dateStart: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
    });

    // this.formGroup.get('departureLocationId')?.valueChanges.subscribe(selectedLocationId => {
    //   // Tìm kiếm địa điểm đã chọn trong danh sách locations
    //   const selectedDeparture = this.locations.find(location => location.locationId === selectedLocationId);
    //   console.log(selectedDeparture);
    // });
    // this.formGroup.get('arrivalLocationId')?.valueChanges.subscribe(selectedLocationId => {
    //   // Tìm kiếm địa điểm đã chọn trong danh sách locations
    //   const selectedArrival = this.locations.find(location => location.locationId === selectedLocationId);
    //   console.log(selectedArrival);
    // });
    this.formGroup.get('dateStart')?.valueChanges.subscribe((value) => {
      if (value) {
        const formattedDateStart = this.datePipe.transform(value, 'HH:mm:ss dd/MM/yyyy');
        console.log('Formatted Date:', formattedDateStart); // Bạn có thể lưu hoặc xử lý định dạng tại đây
      }
    });
    this.formGroup.get('dateEnd')?.valueChanges.subscribe((value) => {
      if (value) {
        const formattedDateEnd = this.datePipe.transform(value, 'HH:mm:ss dd/MM/yyyy');
        console.log('Formatted Date:', formattedDateEnd); // Bạn có thể lưu hoặc xử lý định dạng tại đây
      }
    });

    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'departureLocationName', header: 'Departure Name' },
      { field: 'arrivalLocationName', header: 'Arrival Name' },
      { field: 'dateStart', header: 'DateStart' },
      { field: 'dateEnd', header: 'DateEnd' },
      { field: 'status', header: 'Status' }
    ];
 
  }
  onDateEndChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formGroup.patchValue({ dateEnd: input.value });
    this.dateEndSelected = true; // Đánh dấu là đã chọn ngày
  }

  //Này là mở hộp thoại thêm mới
  openNew() {
    this.trip = {};
    this.submitted = false;
    this.tripDialog = true;
  }
  editTrip(trip: Trip) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      tripId: trip.tripId,
      departureLocationId: trip.departureLocationId,
      arrivalLocationId: trip.arrivalLocationId,
      dateStart: trip.dateStart,
      dateEnd: trip.dateEnd
    });
    //Mở hộp thoại thêm
    this.tripDialog = true;
  }

  deleteTrip(trip: Trip) {
    this.deleteTripDialog = true;
    this.trip = { ...trip };

  }
  confirmDelete() {
    this.deleteTripDialog = false;
    this.trip.status = 0;
    //Xóa ở đây chỉ là set cái status về lại = 0 =>Update
    console.log(this.trip);
    this.tripService.update(this.trip).then(
      res => {
        if (res['status']) {

          this.trips = this.trips.filter(a => a.tripId !== this.trip.tripId);
          console.log(this.trip);

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Trip Deleted', life: 3000 });
          this.trip = {};
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete trip', life: 3000 });

      }
    )

  }

  hideDialog() {
    this.tripDialog = false;
    this.submitted = false;
    this.formGroup.reset({
      tripId : '0'
    })
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('tripId').value == 0) {
      //Nếu ID == 0, nghĩa là dữ liệu mỚI
      this.trip = this.formGroup.value as Trip;
      const selectedLocationId = this.formGroup.get('departureLocationId')?.value;
      const selectedDeparture = this.locations.find(location => location.locationId === selectedLocationId);
      if (selectedDeparture) {
        this.trip.departureLocationId = selectedDeparture.locationId;
        this.trip.departureLocationName = selectedDeparture.name;
      } else {
        console.error('Not found');
      }
      const selectedArrival = this.locations.find(location => location.locationId === selectedLocationId);
      if (selectedArrival) {
        this.trip.arrivalLocationId = selectedArrival.locationId;
        this.trip.arrivalLocationName = selectedArrival.name;
      } else {
        console.error('Not found');
      }
      this.trip.dateStart = this.datePipe.transform(this.formGroup.get('dateStart')?.value, 'HH:mm:ss dd/MM/yyyy');
      this.trip.dateEnd = this.datePipe.transform(this.formGroup.get('dateEnd')?.value, 'HH:mm:ss dd/MM/yyyy');
      this.trip.status = 1;
      this.tripService.create(this.trip).then(
        res => {
          if (res['status']) {
            this.tripDialog = false;
            this.formGroup.reset()

            //Tăng ID mới lên 1
            let newTripId = this.trips[this.trips.length - 1].tripId + 1;


            this.trip.tripId = newTripId;
            this.trips.push(this.trip);
          }

        },
        error => {
          alert("Lỗi")
        }
      )
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.trip = this.formGroup.value as Trip;
      const selectedLocationId = this.formGroup.get('locationId')?.value;
      const selectedDeparture = this.locations.find(location => location.locationId === selectedLocationId);
      if (selectedDeparture) {
        this.trip.tripId = selectedDeparture.locationId;
        this.trip.departureLocationName = selectedDeparture.name;
      } else {
        console.error('Not found');
      }
      this.trip.dateStart = this.datePipe.transform(this.formGroup.get('dateStart')?.value, 'HH:mm:ss dd/MM/yyyy');
      this.trip.dateEnd = this.datePipe.transform(this.formGroup.get('dateEnd')?.value, 'HH:mm:ss dd/MM/yyyy');
      this.trip.status = 1;
      this.tripService.update(this.trip).then(
        res => {
          if (res['status']) {
            this.tripDialog = false;
            this.formGroup.reset()

            // Tạo ra mảng mới với đối tượng đã được cập nhật
            this.trips = this.trips.map(a =>
              a.tripId === this.trip.tripId ? { ...this.trip } : a
            );

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
