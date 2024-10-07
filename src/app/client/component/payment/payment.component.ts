import { Component, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { Booking } from '../../../entity/booking.entity';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { BookingService } from '../../../service/booking.service';
import { Payment } from '../../../entity/payment.entity';
import { PaymentService } from '../../../service/payment.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgxPayPalModule,
    ToastModule,
    CommonModule
  ],
  providers:[MessageService],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})


export class PaymentComponent implements OnInit {

  selectedPaymentMethod: string = '';

  booking: Booking = {};
  bookingdetails: BookingDetail[] = []
  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private router: Router
  ) { }

  payment: Payment = {};
  payments: Payment[] = [];

  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.booking = this.bookingService.getBooking();
    this.bookingdetails = this.bookingService.getBookingDetails();
    console.log(this.booking);

    if (!this.booking || Object.keys(this.booking).length === 0 || this.bookingdetails.length === 0) {
      this.router.navigate(['/home']);
    }

    this.initConfig();
  }

  onPaymentMethodChange(method: string) {
    this.selectedPaymentMethod = method;
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId: 'sb',
      // for creating orders (transactions) on server see
      // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
      createOrderOnServer: (data: any) => fetch('https://localhost:7273/api/Payment/create-paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingDTO: this.booking,
          bookingDetailDTOs: this.bookingdetails
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
        var executedto ={
            payerId: approveData.payerID,
            paymentId: approveData.paymentID,
        }
        return fetch('https://localhost:7273/api/Payment/execute-paypal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            dto:executedto,           
            bookingDTO: this.booking,
            bookingDetailDTOs: this.bookingdetails
          })
        }).then((response: any) => {
          return response.json();
        }).then((details) => {
          console.log('Payment details:', details);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Authorization created for ' + details.payer_given_name });
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'Transaction cancelled' });
      },
      onError: err => {
        console.log('OnError', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Transaction error' });
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
