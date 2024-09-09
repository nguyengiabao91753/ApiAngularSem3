import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { VehicleTypeComponent } from './admin/component/vehicle-type/vehicle-type.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children:[
            {
                path:'table',
                component: VehicleTypeComponent
            }
        ]
    }
];
