import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { SeatService } from '../../../service/seat.service';
import { AssetService } from '../../../service/AssetService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BusesTripService } from '../../../service/busestrip.service';
import { BusSeatService } from '../../../service/busseat.service';
import { TripService } from '../../../service/trip.service';
import { BusesTrip } from '../../../entity/bustrip.entity';
import { BusSeat } from '../../../entity/busseat.entity';
import { AgeGroup } from '../../../entity/agegroup.entity';
import { AgeGroupService } from '../../../service/agegroup.service';
import { DropdownModule } from 'primeng/dropdown';
import { Booking } from '../../../entity/booking.entity';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BookingService } from '../../../service/booking.service';
import { AccountUserService } from '../../../service/accountUser.service';
import { jwtDecode } from 'jwt-decode';
import { AccountUser } from '../../../entity/accountUser.entity';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    FloatLabelModule,
    DialogModule,
    ToastModule,
    Ripple
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  bookingForm!: FormGroup

  bustripId: number
  bustrip: BusesTrip = {}
  seats: BusSeat[] = [];
  agegroups: AgeGroup[] = []

  booking: Booking = {}
  selectedSeats: { Id: number, name: any, price: number, ageGroupId?: number, discount?: number }[] = [];
  price: number; // example price for a seat
  subtotal: number = 0;
  currency: string = 'USD';

  accountUser: AccountUser = null;

  confirm= false;

  // = [
  //   { Id: 1, name: 'A1', status: '1' },
  //   { Id: 2, name: 'A2', status: '0' },
  //   { Id: 3, name: 'A3', status: '1' },
  //   { Id: 4, name: 'A4', status: '1' },
  //   { Id: 5, name: 'A5', status: '1' },
  //   { Id: 6, name: 'A6', status: '1' },
  // ];
  seatSignals: { Id: number, signalstatus: string }[] = [];

  seatRows: any[] = [];
  constructor(
    private fb: FormBuilder,
    private accountUserService: AccountUserService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private bustripService: BusesTripService,
    private tripService: TripService,
    private busSeatService: BusSeatService,
    private agegroupService: AgeGroupService,
    private assetService: AssetService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnDestroy(): void {
    // sessionStorage.removeItem('ticket-detail-reloaded');
  }
  async ngOnInit() {

    // Kết nối đến SignalR Hub
    this.seatService.startConnection();
    this.seatService.listenForSeatSelection();
    console.log(this.seatService.seats);
    const token = localStorage.getItem('jwtToken');
    if (token) {


      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.nameid; // Assuming ClaimTypes.NameIdentifier is decoded as `nameid`
      console.log('Extracted userId:', userId);

      if (userId) {
        // Fetch user data from backend using userId
        this.accountUserService.GetUserProfile().subscribe(
          (accountUser: any) => {
            if (accountUser) {
              this.accountUser = accountUser;
              this.booking.fullName = accountUser.fullName
              this.booking.email = accountUser.email
              this.booking.phoneNumber = accountUser.phoneNumber
              this.booking.userId = accountUser.userId
              console.log(accountUser);
              console.log(this.booking);


            }
          },

        );
      }
    }
    await this.loadBusTrip();


    this.seats.forEach(s => {
      this.seatService.seats.set(s.seatId, s.status);
      this.seatSignals.push({ Id: s.seatId, signalstatus: s.status.toString() });
    });
    this.organizeSeats();



  }

  async loadBusTrip() {
    this.bustripId = +this.route.snapshot.paramMap.get('id')!;
    this.bustrip = await this.bustripService.getById(this.bustripId) as BusesTrip;
    this.agegroups = await this.agegroupService.getAll() as AgeGroup[];
    this.seats = await this.busSeatService.getSeatsByBusId(this.bustrip.busId) as BusSeat[];
    this.price = parseInt(this.bustrip.price);
    // this.booking = this.bookingService.getBooking();
    this.selectedSeats = this.bookingService.getBookingDetails() as [];

  }

  toggleSeat(seat: any): void {
    // Kiểm tra trạng thái hiện tại của ghế
    if (seat.status === 0 || this.seatService.seats.get(seat.seatId) == 0) {

      return;
    }
   

    var signalObj = this.seatSignals.find(s => s.Id === seat.seatId);

    if (this.selectedSeats.length >= 5 && signalObj.signalstatus == '1') {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'You have selected the maximum number of allowed seats!' });
      return;
    } 

    const newStatus = signalObj.signalstatus == '1' ? '0' : '1';
    
    signalObj.signalstatus = newStatus;
    this.seatService.selectSeat(seat.seatId, parseInt(newStatus));
    if (this.isSeatSelected(seat)) {
      var newselect = {
        Id: parseInt(seat.seatId),
        name: seat.name,
        price: parseInt(this.bustrip.price)
      }
      this.selectedSeats.push(newselect);
    } else {
      this.selectedSeats = this.selectedSeats.filter(a => a.Id != seat.seatId)
    }
    this.subtotal = 0;
    this.selectedSeats.forEach(a => {
      this.subtotal += a.price
    })
    console.log(this.selectedSeats);

  }

  isSeatDisabled(seat: any): boolean {
    return this.seatService.seats.get(seat.seatId) == 0;
  }

  isSeatSelected(seat: any) {
    var check = this.selectedSeats.find(a => a.Id == seat.seatId);
    if (check != null) {

      return false
    }

    return true;
  }

  updatePriceAfterDiscount(seat: any) {
    const ageGroup = this.agegroups.find(a => a.ageGroupId === seat.ageGroupId);
    if (ageGroup) {
      seat.discount = parseInt(ageGroup.discount || '0');
      seat.price = this.price - (this.price * seat.discount / 100);
    }
    this.calculateSubtotal();
  }
  calculateSubtotal() {
    this.subtotal = 0;
    this.selectedSeats.forEach(seat => {
      this.subtotal += seat.price;
    });
  }

  organizeSeats() {
    const rows = [];
    for (let i = 0; i < this.seats.length; i += 4) {
      const leftSide = this.seats.slice(i, i + 2);
      const rightSide = this.seats.slice(i + 2, i + 4);
      rows.push({ left: leftSide, right: rightSide });
    }
    this.seatRows = rows;
  }

  confirmBooking() {
    this.confirm = true;
  }

  Submit(bookingForm: any) {
    if (!bookingForm.valid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all the required information.', life: 5000 });
      //alert("Please fill in all the required information.")
      return;
    }
    if(this.selectedSeats.length==0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one seat.', life: 5000 });
      return;
    }
    this.booking.busTripId = this.bustripId
    this.booking.userId = 0;
    this.booking.bookingDate = "14:30:15 29/09/2024";
    this.booking.paymentStatus = 0;
    this.booking.total = this.subtotal;
    var bookingdetails: BookingDetail[] = [];
    this.selectedSeats.forEach(s => {
      const detail: BookingDetail = {
        bookingDetailId: 0,
        bookingId: 0,
        seatId: s.Id,
        seatName: s.name,
        ageGroupId: s.ageGroupId,
        ageGroupName: "",
        priceAfterDiscount: s.price,
        ticketCode: "",
        ticketStatus: 1
      };
      bookingdetails.push(detail);
    })
    this.bookingService.setBooking(this.booking);
    this.bookingService.setBookingDetails(bookingdetails);
    // this.booking={};
    // this.selectedSeats=[]
    this.router.navigate(['/payment']);




  }

}
