import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-negociar',
  templateUrl: './modal-negociar.component.html',
  styleUrls: ['./modal-negociar.component.scss']
})
export class ModalNegociarComponent implements OnInit {

  nomeCliente
  totalPayment
  saldoDevedor : number = 100;
  today
  parcialPayment
  precoParcial
  valorTotalAhPagar
  invoiceNumber

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor() { }

  ngOnInit(): void {
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
  }

}
