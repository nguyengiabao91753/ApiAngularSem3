import { CommonModule, DatePipe } from '@angular/common';
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
import { Bus } from '../../../entity/bus.entity';
import { BusService } from '../../../service/bus.service';
import { Trip } from '../../../entity/trip.entity';
import { TripService } from '../../../service/trip.service';

@Component({
  selector: 'app-busestrip',
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
  templateUrl: './busestrip.component.html',
  styleUrl: './busestrip.component.css'
})
export class BusestripComponent implements OnInit {

  busestrip: BusesTrip = {}
  busestrips: BusesTrip[] = []

  busestripsofBus: BusesTrip[] = []

  originBusTripList: BusesTrip[] = []

  buses: Bus[] = []
  originbuses: Bus[] = []

  trips: Trip[] = []
  origintrips: Trip[] = []

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
    private tripService: TripService,
    private busService: BusService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {

  }
  async ngOnInit() {
    this.busestrips = await this.busestripService.getAll() as BusesTrip[]
    this.originBusTripList = await this.busestripService.getAll() as BusesTrip[]
    this.buses = await this.busService.getAll() as Bus[]
    this.originbuses = [...this.buses];
    console.log(this.buses);

    this.origintrips = await this.tripService.getAll() as Trip[]
    // Lọc ra những trips không có trong busestrips qua tripId
    this.trips = this.origintrips.filter(t => !this.busestrips.some(b => b.tripId === t.tripId)  && t.status == 1);


    this.formGroup = await this.formBuilder.group({
      busTripId: '0',
      busId: ['', [Validators.required]],
      tripId: ['', [Validators.required]],
      price: ['', [Validators.required],Validators.min(1), Validators.pattern(/^(?:[1-9]\d{0,2}(\.\d{1,2})?|1000(\.0{1,2})?)$/) ],
      status: 1
    });

    this.cols = [
      { field: 'busTripId', header: 'Id' },
      { field: 'busTypeName', header: 'Bus' },
      { field: 'departureLocationName', header: 'Departure' },
      { field: 'arrivalLocationName', header: 'Arrival' },
      { field: 'dateStart', header: 'Start' },
      { field: 'DateEnd', header: 'End' },
      { field: 'price', header: 'Price' },
      { field: 'status', header: 'Status' }
    ];

  }

  //Này là mở hộp thoại thêm mới
  openNew() {
    this.busestrip = {};
    this.buses = [...this.originbuses];
    this.trips = [...this.origintrips];
    this.submitted = false;
    // this.formGroup.reset();
    this.formGroup.reset({
      busTripId: '0'
    });
    this.bustripDialog = true;
  }

  //Cái này xóa nhiều
  deleteSelectedBusesTrips() {
    this.deleteBusTripDialog = true;
  }

  editBusTrip(bustrip: BusesTrip) {
    //Gán dữ liệu được chọn vào form
    this.formGroup.patchValue({
      busTripId: bustrip.busTripId,
      busId: bustrip.busId,
      tripId: bustrip.tripId,
      price: bustrip.price

    });
    //Mở hộp thoại thêm
    this.bustripDialog = true;
  }

  deleteBusTrip(bustrip: BusesTrip) {
    this.deleteBusTripDialog = true;
    this.busestrip = { ...bustrip };

  }

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
    this.formGroup.reset({
      busTripId: '0'
    });
  }

  save() {
    this.submitted = true;
    if (this.formGroup.get('busTripId').value == 0) {
      //Nếu ID == 0, nghĩa là dữ liệu mới
      this.busestrip = this.formGroup.value as BusesTrip;
      this.busestrip.price = this.busestrip.price.toString()
      this.busestripService.create(this.busestrip).then(
        res => {
          if (res['status']) {
            this.bustripDialog = false;
            this.formGroup.reset()
            this.ngOnInit();
            // let newId = this.originBusTripList[this.originBusTripList.length - 1].busTripId + 1;
            // this.busestrip.busTripId = newId;
            // this.busestrips.push(this.busestrip);
          }

        },
        error => {
          alert("Lỗi")
        }
      )
    } else {
      //Khác 0 nghĩa là đã có dữ liệu khác => Update
      this.busestrip = this.formGroup.value as BusesTrip;
      this.busestrip.price = this.busestrip.price.toString()
      this.busestripService.update(this.busestrip).then(
        res => {
          if (res['status']) {
            this.bustripDialog = false;
            this.formGroup.reset()

            console.log(this.busestrip);

            this.busestrips = this.busestrips.map(a =>
              a.busTripId === this.busestrip.busTripId ? { ...a, ...this.busestrip } : a
            );
            //kết hợp cả hai đối tượng. Nếu có trường nào trùng lặp giữa a và this.busestrip, 
            //giá trị từ this.busestrip sẽ ghi đè giá trị trong a, trong khi các trường khác không có trong this.busestrip 
            //vẫn được giữ lại từ a.
            //{...agegroup} là copy đối tượng đó gắn cho đối tượng đc gắn, [...aaa] là copy mảng
          }


        },
        error => {
          alert("Lỗi")
        }
      )
    }


  }


  selectBus(busId) {
    console.log(busId.value);

    this.busestripsofBus = this.busestrips.filter(b => b.busId == busId.value)
    var bus = this.buses.find(b => b.busId == busId.value);
    this.trips = this.origintrips.filter(t => t.arrivalLocationId == bus.locationId && t.status == 1);
    // if (this.busestripsofBus.length > 0) {
    //   const dateEndOfBusTrip = this.convertToDate(this.busestripsofBus[0].dateEnd);
    //   console.log('Ngày kết thúc chuyến xe:', dateEndOfBusTrip);

    //   this.trips = this.origintrips.filter(t => {
    //     const dateStartOfTrip = this.convertToDate(t.dateStart);
    //     // console.log('Ngày bắt đầu của trip:', dateStartOfTrip);

    //     // So sánh trực tiếp giữa các đối tượng Date
    //     return (dateStartOfTrip > dateEndOfBusTrip && t.departureLocationName == this.busestripsofBus[0].arrivalLocationName);
    //   });
    //   console.log(this.busestripsofBus[0].dateStart);
      
      
    // }

    // this.trips = this.origintrips.filter(t => t.status==1);

  }
  selectTrip(tripId) {
    var trip = this.origintrips.find(t => t.tripId == tripId.value);
    // if (!trip) return;

    // console.log("Trip selected:", trip);

    // // Lấy các chuyến hoàn thành trước chuyến mới
    // var completedTrips: BusesTrip[] = this.busestrips.filter(b => 
    //   b.arrivalLocationName == trip.departureLocationName &&
    //   this.convertToDate(b.dateEnd) < this.convertToDate(trip.dateStart)
    // );
    // console.log("Completed trips:", completedTrips);
    // if (completedTrips.length > 0) {
    //     this.buses = this.buses.filter(b => completedTrips.some(bt => bt.busId === b.busId) && b.status === 1);
    

    //     console.log("Buses with latest completed trips:", this.buses);
    // } else {
    //     this.buses = this.buses.filter(b => b.status === 1); 
    // }

    this.buses = this.buses.filter(b=>b.locationId == trip.departureLocationId && b.status == 1); 
}


  convertToDate(dateString: string): Date {
    const date = dateString.split(' ')[1];
    // console.log(date);
    
    const parts = date.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Tháng trong Date là từ 0-11
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
