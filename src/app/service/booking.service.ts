import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { lastValueFrom } from "rxjs";
import { Booking } from "../entity/booking.entity";
import { BookingDetail } from "../entity/bookingdetail.entity";

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private booking: Booking = {};
  private bookingDetails: BookingDetail[] = [];
  constructor(
    private httpClient: HttpClient,
    private baseurl: BaseUrlService
  ) { }

  async create(booking: any, bookingDetails: any[]) {
    const payload = {
      bookingDTO: booking,
      bookingDetailDTOs: bookingDetails
    };
    return lastValueFrom(this.httpClient.post(this.baseurl.BASE_URL + 'booking/create', payload));
  }

  async getAll() {
    return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL + 'booking/getall'));
  }
  async getAllByEmail(email: any){
    return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL+'booking/getbookingbyemail/'+email))
  }
  async getBookingRequestByTicketCode(ticketCode: any) {
    return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL + 'booking/getbookingrequestbyticketcode/'+ticketCode));
  }
  async useTicket(ticketCode: any) {
    return lastValueFrom(this.httpClient.get(this.baseurl.BASE_URL + 'booking/useticket/'+ticketCode));
  }

  setBooking(booking: Booking) {
    this.booking = booking;
  }

  getBooking(): Booking | null {
    return this.booking;
  }

  setBookingDetails(details: BookingDetail[]) {
    this.bookingDetails = details;
  }

  getBookingDetails(): BookingDetail[] {
    return this.bookingDetails;
  }

}