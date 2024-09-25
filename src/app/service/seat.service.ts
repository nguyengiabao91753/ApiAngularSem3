import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { BaseUrlService } from "./baseUrl.service";

@Injectable({
    providedIn: 'root'
})
export class SeatService{
    private hubConnection: signalR.HubConnection;
    public seats: Map<number, number> = new Map(); // seatId và status

    constructor(
        private baseurl: BaseUrlService
    ) {
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(baseurl.LOCAL_URL+'seatHub')
          .build();
      }


      public startConnection(): void {
        this.hubConnection.start().then(() => {
          console.log('SignalR connected.');
        }).catch(err => console.log('Error while starting SignalR: ' + err));
      }
    
      public listenForSeatSelection(): void {
        this.hubConnection.on('ReceiveSeatSelection', (seatId: number, status: number) => {
          this.seats.set(seatId, status);
          console.log(`Seat ${seatId} has been updated to status ${status}.`);
        });
      }
    
      public selectSeat(seatId: number, status: number): void {
        this.hubConnection.invoke('SelectSeat', seatId, status)
          .catch(err => console.error(err));
      }
}