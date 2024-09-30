import { RouterModule, Routes } from '@angular/router';
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
import { LoginAdminComponent } from './admin/auth/loginAdmin/loginAdmin.component';
import { PolicyComponent } from './admin/component/policy/policy.component';
import { UserComponent } from './admin/auth/user/user.component';
import { AccountComponent } from './admin/auth/account/account.component';
import { AuthGuard } from './entity/auth.services';
import { InActiveComponent } from './admin/auth/in-active/in-active.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        
        children:[
            {
                path:'agegroup',
                component: AgegroupComponent
            },
            {
                path:'policy',
                component: PolicyComponent
            },

            {
                path:'user',
                component: UserComponent    
            },
            {
                path:'account',
                component: AccountComponent
            },
            {
                path:'inActive',
                component: InActiveComponent
            },
        ]
    },
    // login danh cho admin
    {
        path:'auth/loginAdmin',
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
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
export class AppRoutingModule {}
