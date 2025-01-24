import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ListarComponent } from '../../pages/services/listar/listar.component';
import { CriarComponent } from '../../pages/services/criar/criar.component';
import { ImpressaoComponent } from 'src/app/components/impressao/impressao/impressao.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'services/listar', component: ListarComponent },
    { path: 'services/criar', component: CriarComponent },
    { path: 'impressao', component: ImpressaoComponent}
];
