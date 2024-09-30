import { Component, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { Booking } from '../../../entity/booking.entity';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { BookingService } from '../../../service/booking.service';
import { Payment } from '../../../entity/payment.entity';
import { PaymentService } from '../../../service/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgxPayPalModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  booking: Booking = {};
  bookingdetails: BookingDetail[] = []
  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) { }

  payment: Payment = {};
  payments: Payment[] = [];

  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.booking = this.bookingService.getBooking() || { bookingId: 9 };
    this.bookingdetails = this.bookingService.getBookingDetails();
    console.log(this.booking);

    this.initConfig();
  }

  private initConfig(): void {
    const mockBookingId = this.booking.bookingId ?? 9;
    this.payPalConfig = {
      clientId: 'sb',
      // for creating orders (transactions) on server see
      // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
      createOrderOnServer: (data: any) => fetch(`https://localhost:7273/api/Payment/create-paypal/${mockBookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: mockBookingId
        })
      })
        .then((res) => res.json())
        .then((order) => {
          console.log('Order created on server:', order);
          return order.token;  
        })
        .catch(error => {
          console.error('Error creating PayPal transaction:', error);
          throw error;
        }),
      authorizeOnServer: (approveData: any) => {
        console.log('approveData:', approveData);
        return fetch(`https://localhost:7273/api/Payment/execute-paypal/${mockBookingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payerId: approveData.payerID,
            paymentId: approveData.paymentID
          })
        }).then((response: any) => {
          return response.json();
        }).then((details) => {
          console.log('Payment details:', details);
          alert('Authorization created for ' + details.payer_given_name);
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
