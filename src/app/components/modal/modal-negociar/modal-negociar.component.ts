import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';

@Component({
  selector: 'app-modal-negociar',
  templateUrl: './modal-negociar.component.html',
  styleUrls: ['./modal-negociar.component.scss']
})
export class ModalNegociarComponent implements OnInit {
  @Input() ordemServico: OrdemServico | undefined;

  nomeCliente
  totalPayment
  saldoDevedor : number = 100;
  today : Date = new Date();
  parcialPayment
  precoParcial
  valorTotalAhPagar
  invoiceNumber
  

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor() { }

  ngOnInit(): void {
    this.nomeCliente = this.ordemServico.cliente.nome
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
  }

}
