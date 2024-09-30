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
import { Booking } from '../../../entity/booking.entity';
import { BookingService } from '../../../service/booking.service';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { BusesTripService } from '../../../service/busestrip.service';
import { BusesTrip } from '../../../entity/bustrip.entity';

@Component({
  selector: 'app-booking',
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
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  booking: Booking = {}
  bookings: Booking[] = []
  details: BookingDetail[] = []
  detailsBelongBooking: BookingDetail[]=[]

  bustrip: BusesTrip = {}
  bustrips: BusesTrip[] = []

  bookingDetailDialog = false
  formGroup!: FormGroup

  //For notications
  bookingDialog: boolean = false


  //For Table
  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private bookingService: BookingService,
    private bustripService: BusesTripService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {

    this.bookingService.getAll().then(
      res => {
        this.bookings = res['booking'] as Booking[];
        this.details = res['details'] as BookingDetail[];
      }
    )
    this.bustripService.getAll().then(
      res => {
        this.bustrips = res as BusesTrip[]
      }
    )

    this.cols = [
      { field: 'bookingId', header: 'Id' },
      { field: 'fullName', header: 'Full Name' },
      { field: 'email', header: 'Email' },
      { field: 'busTripId', header: 'Trip' },
      { field: '', header: 'Ticket' },
      { field: 'bookingDate', header: 'Booking Date' },
      { field: 'paymentStatus', header: 'Status' },
      { field: 'detail', header: 'Detail' }
    ];

  }
  hideDialog() {
    this.bookingDetailDialog = false;
  }
  countTicket(bookingId: number){
    var count = this.details.filter(a=>a.bookingId == bookingId).length;
    return count
  }
  generateTrip(busTripId: number) {
    this.bustrip = this.bustrips.find(a => a.busTripId == busTripId)
    return this.bustrip.departureLocationName + " - " + this.bustrip.arrivalLocationName;
  }
  generateTripDate(busTripId: number) {
    this.bustrip = this.bustrips.find(a => a.busTripId == busTripId)
    return this.bustrip.dateStart + " - " + this.bustrip.dateEnd;
  }



  showDetail(booking: any){
    this.bookingDetailDialog = true;
    this.booking = {...booking}
    this.detailsBelongBooking = this.details.filter(a => a.bookingId == this.booking.bookingId)
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
