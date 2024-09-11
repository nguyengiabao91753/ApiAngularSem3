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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Personal Information',
                items: [
                    { label: 'User', icon: 'pi pi-fw pi-users', routerLink: ['/'] },
                    { label: 'Account', icon: 'pi pi-fw pi-unlock', routerLink: ['/'] },
                    
                ]
            },
            {
                label: 'Bus Information',
                items: [
                    { label: 'Bus Type', icon: 'pi pi-fw pi-align-justify', routerLink: ['/'] },
                    { label: 'Buses', icon: 'pi pi-fw pi-truck', routerLink: ['/'] },
                    
                    
                ]
            },
            {
                label: 'Trip Information',
                items: [
                    { label: 'Location', icon: 'pi pi-fw pi-map', routerLink: ['/'] },
                    { label: 'Trip', icon: 'pi pi-fw pi-angle-double-up', routerLink: ['/'] },
                ]
            },
            {
                label: 'BusTrip & Booking',
                items: [
                    { label: 'BusTrip', icon: 'pi pi-fw pi-arrow-up-right', routerLink: ['/'] },
                    { label: 'Booking', icon: 'pi pi-fw pi-bookmark', routerLink: ['/'] },
                ]
            },
            {
                label: 'Policy & Discount',
                items: [
                    { label: 'Policy', icon: 'pi pi-fw pi-folder', routerLink: ['/'] },
                    { label: 'Agegroup', icon: 'pi pi-fw pi-percentage', routerLink: ['/admin/agegroup'] },
                ]
            }
        ];
    }
}
