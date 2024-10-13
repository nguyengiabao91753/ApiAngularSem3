import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusesTrip } from '../../../entity/bustrip.entity';
import { BusesTripService } from '../../../service/busestrip.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '../../../entity/location.entity';
import { LocationService } from '../../../service/locationService';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { LocaleService, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AppComponent } from '../../../app.component';
import { AssetService } from '../../../service/AssetService.service';
import { BusType } from '../../../entity/bustype.entity';
import { BusTypeService } from '../../../service/bustype.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    CalendarModule,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit, AfterViewInit {
  bustrips: BusesTrip[] = []
  bustripSubmits: BusesTrip[] = []
  originbustrips: BusesTrip[] = []
  selectedTypes: string[] = [];


  formgroup: FormGroup
  locations: Location[] = []
  busTypes: BusType[] = []

  today = new Date().toISOString().split('T')[0];
  constructor(
    private bustripService: BusesTripService,
    private assetService: AssetService,
    private locationService: LocationService,
    private busTypeService: BusTypeService,
    private formbuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    // this.assetService.removeCss('client/assets/global/css/daterangepicker.css');
    // this.assetService.removeJs('client/assets/global/js/select2.min.js');
    // this.assetService.removeJs('client/assets/global/js/jquery-3.7.1.min.js');
    // this.assetService.removeJs('client/assets/global/js/daterangepicker.min.js');
    // this.assetService.addJs('client/assets/global/js/ticketdate.js');

    this.bustripService.getAllActive().then(
      res => {
        // this.bustrips = res as BusesTrip[]
        this.originbustrips = res as BusesTrip[]
        this.bustripSubmits = [...this.originbustrips]
        this.bustrips = [...this.originbustrips]
      }
    )
    this.locationService.getAll().then(
      res => {
        this.locations = res as Location[]
      }
    )
    this.busTypeService.getAll().then(
      res => {
        this.busTypes = res as BusType[]
      }
    )

    this.formgroup = this.formbuilder.group({
      departure: 0,
      arrival: 0,
      dateStart: this.today
    })
  }
  ngAfterViewInit(): void {
    const calendarIcon = document.querySelector('.custom-calendar-icon');
    const dateInput = document.querySelector('.custom-date-input') as HTMLInputElement;

    if (calendarIcon && dateInput) {
      calendarIcon.addEventListener('click', () => {
        dateInput.showPicker();
      });
    }

  }



  calculateTimeDifference(start: string, end: string): string {
    const parseDate = (dateString: string): Date => {
      const [time, date] = dateString.split(' ');
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const [day, month, year] = date.split('/').map(Number);

      // Tạo đối tượng Date mới với giờ, phút, giây, ngày, tháng và năm
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const startDate = parseDate(start); // Chuyển chuỗi thành đối tượng Date
    const endDate = parseDate(end); // Chuyển chuỗi thành đối tượng Date

    const diff = Math.abs(endDate.getTime() - startDate.getTime()); // Tính chênh lệch
    const hours = Math.floor(diff / (1000 * 60 * 60)); // Chuyển từ mili giây sang giờ
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes == 0) {
      return `${hours} h`;
    }
    return `${hours} h ${minutes} m`;
  }



  filterSubmit() {
    const departure = this.formgroup.get('departure')?.value;
    const arrival = this.formgroup.get('arrival')?.value;
    var dateStart = this.formgroup.get('dateStart')?.value;
    console.log(departure);


    this.bustripSubmits = this.originbustrips.filter(t => {
      const tripDate = this.parseDate(t.dateStart);
      console.log(dateStart);

      console.log(tripDate);

      return (departure === 0 || t.departureLocationName == departure) &&
        (arrival === 0 || t.arrivalLocationName == arrival) &&
        (dateStart === null || tripDate == dateStart.toString())

    });

    return this.bustrips = this.bustripSubmits

  }
  private parseDate(dateString: string | undefined): string | null {
    if (!dateString) return null;

    const datePart = dateString.split(' ')[1];

    const [day, month, year] = datePart.split('/').map(Number);

    const date = new Date(year, month - 1, day + 1);

    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
  }

  filterType(type: any) {
    const isChecked = type.checked;
    const typeName = type.value;

    if (isChecked) {
      this.selectedTypes.push(typeName);
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== typeName);
    }

    if (this.selectedTypes.length === 0) {
      this.bustrips = [...this.bustripSubmits];
    } else {
      this.bustrips = this.bustripSubmits.filter(b =>
        this.selectedTypes.includes(b.busTypeName)
      );
    }
  }
  filterAC(ac: any) {
    const isChecked = ac.checked;
    if (isChecked) {
      this.bustrips = this.bustripSubmits.filter(b => b.airConditioned == 1)
    }
    this.bustrips = [...this.bustripSubmits];
  }
  resetfilter(){
    this.selectedTypes=[];
    this.bustrips = [...this.bustripSubmits];
  }

}
