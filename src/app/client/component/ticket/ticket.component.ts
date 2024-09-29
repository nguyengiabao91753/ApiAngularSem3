import { Component, OnInit } from '@angular/core';
import { BusesTrip } from '../../../entity/bustrip.entity';
import { BusesTripService } from '../../../service/busestrip.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit{
  bustrips: BusesTrip[]   =[]
  constructor(
    private bustripService: BusesTripService
  ){}
  async ngOnInit() {
    this.bustrips = await this.bustripService.getAll() as BusesTrip[];
  }


  calculateTimeDifference(start: string, end: string): string {
    const startDate = new Date(start); // Chuyển chuỗi thành đối tượng Date
    const endDate = new Date(end);     // Chuyển chuỗi thành đối tượng Date

    const diff = Math.abs(endDate.getTime() - startDate.getTime()); // Tính chênh lệch
    const hours = diff / (1000 * 60 * 60); // Chuyển từ mili giây sang giờ
    return hours+" h";
  }

}
