import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-modal-cliente-profile',
  templateUrl: './modal-cliente-profile.component.html',
  styleUrls: ['./modal-cliente-profile.component.scss']
})
export class ModalClienteProfileComponent implements OnInit {

  @Input() isModalOpen: boolean = false;  // Recebe a visibilidade
  @Input() invoiceId: number;

  client : Cliente = {} as Cliente | undefined;

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor(private cliente: ClientesService) {
    this.client = undefined;
   }

  ngOnInit(): void {
    this.getClienteByInvoiceNumber();
  }

  getClienteByInvoiceNumber(){
    this.cliente.getClienteByIdOrdemServico(this.invoiceId.toString()).subscribe(
      (cliente) => {
        this.client = cliente;
      },
      (error) => {
        console.error("Não foi possivel localizar o cliente." +error)
      }
    )
  }

  closedModal() {
    this.isModalOpen = false;  // Fecha o modal
    this.close.emit();  // Emite evento para o componente pai
  }

}
