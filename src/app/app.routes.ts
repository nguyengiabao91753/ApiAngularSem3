import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AgegroupComponent } from './admin/component/agegroup/agegroup.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children:[
            {
                path:'agegroup',
                component: AgegroupComponent
            }
        ]
    }
];
