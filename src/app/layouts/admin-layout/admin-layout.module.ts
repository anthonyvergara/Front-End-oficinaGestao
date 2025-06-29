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
import { ModalViewOrdemComponent } from 'src/app/components/modal/modalViewOS/modal-view-ordem.component';
import { ModalCriarClienteComponent } from 'src/app/components/modal/modalCriarCliente/modal-criarCliente.component';
import { ModalViewClienteComponent } from 'src/app/components/modal/modalViewCliente/modal-view-cliente/modal-view-cliente.component';
import { ModalClienteProfileComponent } from 'src/app/components/modal/modal-cliente-profile/modal-cliente-profile.component';
import { ModalPagarComponent } from 'src/app/components/modal/modal-pagar/modal-pagar.component';
import { ModalNegociarComponent } from 'src/app/components/modal/modal-negociar/modal-negociar.component';
import { ModalConfirmComponent } from 'src/app/components/modal/modal-confirm/modal-confirm.component';


import { ImpressaoComponent } from 'src/app/components/impressao/impressao/impressao.component';

import { CriarOrdemComponent } from 'src/app/components/criar-ordem/criar-ordem.component';

import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyFormatDirective } from '../../pages/maps/currency-input.directive';
import { UppercaseDirective } from 'src/app/directives/uppercase.directive';

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
    UppercaseDirective,
    ListarComponent,
    CriarComponent,
    ModalViewOrdemComponent,
    ModalCriarClienteComponent,
    CriarOrdemComponent,
    ModalViewClienteComponent,
    ModalClienteProfileComponent,
    ModalPagarComponent,
    ModalNegociarComponent,
    ImpressaoComponent,
    ModalConfirmComponent
  ],
  exports: [
    MapsComponent // Exportar para que possa ser usado em outros módulos
  ]
})

export class AdminLayoutModule {}
