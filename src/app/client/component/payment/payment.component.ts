import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../service/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  constructor(
    private paymentService: PaymentService
  ){}

  ngOnInit(): void {
    
  }

}
