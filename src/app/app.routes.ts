import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VehicleTypeComponent } from './admin/component/vehicle-type/vehicle-type.component';
import { AgegroupComponent } from './admin/component/agegroup/agegroup.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children:[
            {
                path:'table',
                component: VehicleTypeComponent
            },
            {
                path:'agegroup',
                component: AgegroupComponent
            }
        ]
    }
];
