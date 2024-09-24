import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { SeatService } from '../../../service/seat.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  formGroup: FormGroup
  seats = [
    { Id: 1, name: 'A1', status: '1', sigstatus:'1' },
    { Id: 2, name: 'A2', status: '0', sigstatus:'0' },
    { Id: 3, name: 'A3', status: '1', sigstatus:'1' },
    { Id: 4, name: 'A4', status: '1', sigstatus:'1' },
    { Id: 5, name: 'A5', status: '1', sigstatus:'1' },
    { Id: 6, name: 'A6', status: '1', sigstatus:'1' },
  ];

  private hubConnection: signalR.HubConnection;
  seatRows: any[] = [];
  constructor(
    private seatService: SeatService
  ){}
  ngOnInit() {
    // Kết nối đến SignalR Hub
    this.seatService.startConnection();
    this.seatService.listenForSeatSelection();
    console.log(this.seatService.seats);
    
    this.seats.forEach(s=> this.seatService.seats.set(s.Id, parseInt(s.status)));
    this.organizeSeats();
    

    
  }
  toggleSeat(seat: any): void {
    // Kiểm tra trạng thái hiện tại của ghế
    if (seat.status === '0' || this.seatService.seats.get(seat.Id) == 0) {

      return; 
    }

    // Thay đổi trạng thái ghế
    const newStatus = seat.sigstatus == '1' ? '0' : '1';
    seat.sigstatus = newStatus;
    // console.log(this.seatService.seats);
    
    // Gửi sự kiện chọn ghế lên server với trạng thái mới
    this.seatService.selectSeat(seat.Id, parseInt(newStatus));
  }

  isSeatDisabled(seat: any): boolean {
    return this.seatService.seats.get(seat.Id) == 0;
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

}
