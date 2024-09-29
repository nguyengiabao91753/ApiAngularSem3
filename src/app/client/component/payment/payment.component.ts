import { Component, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { Payment } from '../../../entity/payment.entity';
import { PaymentService } from '../../../service/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgxPayPalModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  constructor(
    private paymentService: PaymentService
  ){}

  payment: Payment = {};
  payments: Payment[] =[];
  
  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.paymentService.getAll().then(
      res => {
        this.payment = res as Payment;
        console.log(this.payment);
      }
    )
      this.initConfig();
  }

  private initConfig(): void {
      

      this.payPalConfig = {
          clientId: 'Aa6muE0xAPvHoWCDO5dDj-0w2zo4baRpI_oo92tRDOYVhJppD5EBwgUwieECjMAS5Sh9oBeCV8qLhLuF',
          // for creating orders (transactions) on server see
          // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
          createOrderOnServer: (data: any) => fetch('https://localhost:7273/api/Payment/create-paypal', {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify([
              {
                 
              }
            ])
          })
              .then((res) => res.json())
              .then((order) => order.token),
          authorizeOnServer: (approveData: any) => {
              return fetch('https://localhost:7273/api/Payment/execute-paypal', {
              body: JSON.stringify({
                payerId: approveData.payerID,
                paymentId: approveData.paymentID
              })
            }).then((res) => {
              return res.json();
            }).then((details) => {
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
