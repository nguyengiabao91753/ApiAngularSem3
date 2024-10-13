import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../service/booking.service';
import { Booking } from '../../../entity/booking.entity';
import { BookingDetail } from '../../../entity/bookingdetail.entity';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-checkticket',
  standalone: true,
  providers: [MessageService],
  imports: [
    ZXingScannerModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    BadgeModule
  ],
  templateUrl: './checkticket.component.html',
  styleUrl: './checkticket.component.css'
})
export class CheckticketComponent implements AfterViewInit {

  @ViewChild('scanner') scanner: ZXingScannerComponent;

  hasDevices: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | null = null;

  cameraActive: boolean = false;
  inputActive: boolean = false;

  hasTicket: boolean = false
  hasCheck: boolean = false;
  booking: Booking = {};
  bookingDetail: BookingDetail = {};
  ticketInfor = {
    departure: "",
    arrival: "",
    dateStart: "",
    dateEnd: "",
    fullName: "",
    email: "",
    seatName: "",
    busTypeName: "",
    licensePlate: "",
    ticketCode: "",
    bookingDate: "",
    ticketStatus: 1,
  };
  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private messageService: MessageService
  ) { }
  ngAfterViewInit() {
    if (this.scanner) {
      this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasDevices = devices && devices.length > 0;
        this.availableDevices = devices;

        if (devices.length > 0) {
          this.currentDevice = devices[0];
        }
      });

      this.scanner.permissionResponse.subscribe((perm: boolean) => {
        this.hasPermission = perm;
      });
    } else {
      console.log("Scanner không được tạo");

    }
  }

  startScanning(): void {
    // if (this.scanner) {
    // this.scanner.reset(); 
    this.cameraActive = true;
    console.log(this.cameraActive);

    // }else{
    //   console.log("ko co scanner");

    // }
  }

  stopScanning() {
    if (this.scanner) {
      this.scanner.reset();
      this.cameraActive = false;
    }
  }

  onError(error: any) {
    console.error("Camera error:", error);
  }

  onCodeResult(result: string) {
    this.hasCheck = true
    console.log('Mã QR đã quét:', result);
    this.stopScanning();

    const urlParams = new URL(result).searchParams;
    const ticketCode = urlParams.get('ticketCode');
    console.log('Ticket Code:', ticketCode);
    this.findTicketInfor(ticketCode);
  }
  findTicketInfor(ticketCode: string) {
    this.bookingService.getBookingRequestByTicketCode(ticketCode).then(
      res => {
        this.hasCheck = false;
        if (res['status']) {
          this.ticketInfor = {
            departure: res['departure'],
            arrival: res['arrival'],
            dateStart: res['dateStart'],
            dateEnd: res['dateEnd'],
            fullName: res['fullName'],
            email: res['email'],
            seatName: res['seatName'],
            busTypeName: res['busTypeName'],
            licensePlate: res['licensePlate'],
            ticketCode: res['ticketCode'],
            bookingDate: res['bookingDate'],
            ticketStatus: res['ticketStatus']
          }
          this.hasTicket = true;
        } else {
          this.hasTicket = false
        }
      }
    )
  }
  camerasFound(devices: MediaDeviceInfo[]) {
    console.log('Cameras found:', devices);
    this.availableDevices = devices;

    if (devices.length > 0) {
      this.currentDevice = devices[0]; // Chọn camera mặc định
    }
  }
  useTicket(ticketCode: any) {
    this.bookingService.useTicket(ticketCode).then(
      res => {
        if (res['status']) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Use this ticket', life: 3000 });
          this.ticketInfor.ticketStatus = 0;
        }
      }
    )
  }

  checkExpired(dateEnd: string): boolean {
    if (dateEnd != "") {
      const [time, date] = dateEnd.split(" ");

      const formattedDate = date.split("/").reverse().join("-");

      const endDate = new Date(`${formattedDate}T${time}`);

      const currentDate = new Date();

      return currentDate <= endDate;
    }
    return false;
  }
  checkwithInput(){
    this.inputActive = true
  }
  closeCheckwithInput(){
    this.inputActive = false
  }


}