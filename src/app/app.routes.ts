import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AgegroupComponent } from './admin/component/agegroup/agegroup.component';
import { ClientComponent } from './client/client.component';
import { HomeComponent } from './client/component/home/home.component';
import { TicketComponent } from './client/component/ticket/ticket.component';
import { LoginComponent } from './client/auth/login/login.component';
import { RegisterComponent } from './client/auth/register/register.component';
import { AboutComponent } from './client/component/about/about.component';
import { FaqsComponent } from './client/component/faqs/faqs.component';
import { BlogComponent } from './client/component/blog/blog.component';
import { ContactComponent } from './client/component/contact/contact.component';
import { LoginAdminComponent } from './admin/auth/login/login.component';
import { PolicyComponent } from './admin/component/policy/policy.component';
import { LocationComponent } from './admin/component/location/location.component';
import { TripComponent } from './admin/component/trip/trip.component';
import { BusTypeComponent } from './admin/component/bustype/bustype.component';
import { BusComponent } from './admin/component/bus/bus.component';
import { TicketDetailComponent } from './client/component/ticket-detail/ticket-detail.component';
import { PaymentComponent } from './client/component/payment/payment.component';
import { ProfileComponent } from './client/component/profile/profile.component';
import { DashboardClientComponent } from './client/component/dashboard/dashboard.component';
import { ChangepasswordComponent } from './client/component/changepassword/changepassword.component';
import { BusestripComponent } from './admin/component/busestrip/busestrip.component';
import { DashboardComponent } from './admin/component/dashboard/dashboard.component';
import { BookingComponent } from './admin/component/booking/booking.component';
import { CheckticketComponent } from './admin/component/checkticket/checkticket.component';


export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children:[
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'bus-type',
                component: BusTypeComponent
            },
            {
                path: 'bus',
                component: BusComponent
            },
            {
                path:'agegroup',
                component: AgegroupComponent
            },
            {
                path:'policy',
                component: PolicyComponent
            },
            {
                path:'busestrip',
             
               component: BusestripComponent
            },
            {
                path:'location',
                component: LocationComponent
            },
            {
                path:'trip',
                component: TripComponent
            },
            {
                path:'booking',
                component: BookingComponent
            },
            {
                path:'checkTicket',
                component:CheckticketComponent
            }
            
        ]
    },
    {
        path:'auth/login',
        component: LoginAdminComponent
    },
    {
        path:'',
        component: ClientComponent,
        children:[
            {
                path:'',
                component: HomeComponent
            },
            {
                path:'home',
                component: HomeComponent
            },
            {
                path:'ticket',
                component: TicketComponent
            },
            {
                path:'about',
                component: AboutComponent
            },
            {
                path:'faqs',
                component:FaqsComponent
            },
            {
                path: 'blog',
                component: BlogComponent
            },
            {
                path:'contact-us',
                component: ContactComponent
            },
            {
                path:'ticket-detail/:id',
                component: TicketDetailComponent,
                runGuardsAndResolvers: 'always' //bắt buộc chạy lại ngOnInit
            },
            {
                path:'payment',
                component: PaymentComponent
            },
            {
                path:'profile',
                component: ProfileComponent
            },
            {
                path:'dashboard',
                component: DashboardClientComponent
            },
            {
                path:'changepassword',
                component: ChangepasswordComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'register',
        component: RegisterComponent
    }
];
