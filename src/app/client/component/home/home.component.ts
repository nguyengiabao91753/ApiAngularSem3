import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../service/locationService';
import { CommonModule } from '@angular/common';
import { Location } from '../../../entity/location.entity';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    CalendarModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  locations: Location[]=[]
  date=""
  constructor(
    private locationService: LocationService
  ){}
  ngOnInit(): void {
    

    this.locationService.getAll().then(
      res=>{
        this.locations = res as Location[]
      }
    )
  }

}
