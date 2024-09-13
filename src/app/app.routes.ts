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

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children:[
            {
                path:'agegroup',
                component: AgegroupComponent
            },
            {
                path:'policy',
                component: PolicyComponent
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
            }
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
