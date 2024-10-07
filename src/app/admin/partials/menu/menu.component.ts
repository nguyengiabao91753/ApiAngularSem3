import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../../service/applayout.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    imports:[
      CommonModule,
      AppMenuitemComponent,
      RouterLink
    ]
})
export class MenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }
                ]
            },
            {
                label: 'Personal Information',
                items: [
                    { label: 'User', icon: 'pi pi-fw pi-users', routerLink: ['/admin/user'] },
                    { label: 'Account', icon: 'pi pi-fw pi-unlock', routerLink: ['/admin/account'] },
                    { label: 'InActive', icon: 'pi pi-fw pi-trash', routerLink: ['/admin/inActive'] },
                    
                ]
            },
            {
                label: 'Bus Information',
                items: [
                    { label: 'Bus Type', icon: 'pi pi-fw pi-align-justify', routerLink: ['/admin/bus-type'] },
                    { label: 'Buses', icon: 'pi pi-fw pi-truck', routerLink: ['/admin/bus'] },
                    
                    
                ]
            },
            {
                label: 'Trip Information',
                items: [
                    { label: 'Location', icon: 'pi pi-fw pi-map', routerLink: ['/admin/location'] },
                    { label: 'Trip', icon: 'pi pi-fw pi-angle-double-up', routerLink: ['/admin/trip'] },
                ]
            },
            {
                label: 'BusTrip & Booking',
                items: [
                    { label: 'BusTrip', icon: 'pi pi-fw pi-arrow-up-right', routerLink: ['/admin/busestrip'] },
                    { label: 'Booking', icon: 'pi pi-fw pi-bookmark', routerLink: ['/'] },
                ]
            },
            {
                label: 'Policy & Discount',
                items: [
                    { label: 'Policy', icon: 'pi pi-fw pi-folder', routerLink: ['/admin/policy'] },
                    { label: 'Agegroup', icon: 'pi pi-fw pi-percentage', routerLink: ['/admin/agegroup'] },
                ]
            }
        ];
    }
}
