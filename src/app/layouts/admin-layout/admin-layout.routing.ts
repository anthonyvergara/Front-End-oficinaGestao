import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ListarComponent } from '../../pages/services/listar/listar.component';
import { CriarComponent } from '../../pages/services/criar/criar.component';
import { ImpressaoComponent } from 'src/app/components/impressao/impressao/impressao.component';
import {AuthGuard} from '../auth-layout/auth.guard';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'tables', component: TablesComponent, canActivate: [AuthGuard] },
  { path: 'icons', component: IconsComponent, canActivate: [AuthGuard] },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuard] },
  { path: 'services/listar', component: ListarComponent, canActivate: [AuthGuard] },
  { path: 'services/criar', component: CriarComponent, canActivate: [AuthGuard] },
  { path: 'impressao', component: ImpressaoComponent, canActivate: [AuthGuard] }
];

