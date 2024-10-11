import { Component, OnInit } from '@angular/core';
import { AccountUserService } from '../../../service/accountUser.service';
import { jwtDecode } from 'jwt-decode';
import { AccountUser } from '../../../entity/accountUser.entity';
import { BookingService } from '../../../service/booking.service';
import { Booking } from '../../../entity/booking.entity';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BusesTripService } from '../../../service/busestrip.service';
import { BusService } from '../../../service/bus.service';
import { BusesTrip } from '../../../entity/bustrip.entity';
import { Bus } from '../../../entity/bus.entity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardClientComponent implements OnInit {
  accountUser: AccountUser
  booking: Booking[] = []
  bookingdetails: BookingDetail[] = []
  originbookingdetails: BookingDetail[] = []
  busesTrips: BusesTrip[] = []
  constructor(
    private accountUserService: AccountUserService,
    private bookingService: BookingService,
    private busestripService: BusesTripService,
    private busService: BusService
  ) { }
  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.nameid;
      console.log('Extracted userId:', userId);

      if (userId) {
        // Fetch user data from backend using userId
        this.accountUserService.GetUserProfile().subscribe(
          (accountUser: any) => {
            if (accountUser) {
              this.accountUser = accountUser;
              this.bookingService.getAllByEmail(accountUser.email).then(
                res => {
                  if (res['status']) {
                    this.booking = res['bookings'] as Booking[]
                    this.originbookingdetails = res['data'] as BookingDetail[]
                    
                    const bookingIds = new Set(this.booking.map(book => book.bookingId));
                   
                    this.bookingdetails = this.originbookingdetails.filter(detail => bookingIds.has(detail.bookingId));


                  }
                }
              )
              console.log(accountUser);


            }
          },
          (error) => {
            console.error('Error fetching user data', error);
          }
        );
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }

    this.busestripService.getAll().then(
      res => {
        this.busesTrips = res as BusesTrip[]
      }
    )



  }

  getUserListDetailBooking(bookingId: number) {
    return this.originbookingdetails.filter(detail => detail.bookingId === bookingId)
  }

  getAc(Id: number) {
    var busestrip = this.busesTrips.find(b => b.busTripId == Id);
    if (busestrip.airConditioned == 1) {
      return "AC"
    }
    return "Non-Ac";
  }

  getDeparture(Id: number) {
    var busestrip = this.busesTrips.find(b => b.busTripId == Id);
    return busestrip.departureLocationName
  }
  getArrival(Id: number) {
    var busestrip = this.busesTrips.find(b => b.busTripId == Id);
    return busestrip.arrivalLocationName
  }
  getDateStart(Id: number) {
    var busestrip = this.busesTrips.find(b => b.busTripId == Id);
    return new Date(busestrip.dateStart).toLocaleDateString()
  }
  getTimeStart(Id: number) {
    var busestrip = this.busesTrips.find(b => b.busTripId == Id);
    return new Date(busestrip.dateStart).toLocaleTimeString()
  }
  countBookedTicket() {
    return this.bookingdetails.length;
  }
  countCancelTicket() {
    return this.bookingdetails.filter(b=>b.ticketStatus==2).length;
  }
  countUsedTicket() {
    return this.bookingdetails.filter(b=>b.ticketStatus==0).length;
  }
}
