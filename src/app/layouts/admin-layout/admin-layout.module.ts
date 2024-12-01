import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';

import { ListarComponent } from '../../pages/services/listar/listar.component';
import { CriarComponent } from '../../pages/services/criar/criar.component';
import { ModalComponent } from 'src/app/components/modal/modalListarOS/modal.component';
import { ModalCriarClienteComponent } from 'src/app/components/modal/modalCriarCliente/modal-criarCliente.component';

import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyFormatDirective } from '../../pages/maps/currency-input.directive';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    CurrencyFormatDirective,
    ListarComponent,
    CriarComponent,
    ModalComponent,
    ModalCriarClienteComponent
  ],
  exports: [
    MapsComponent // Exportar para que possa ser usado em outros módulos
  ]
})

export class AdminLayoutModule {}
