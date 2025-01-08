import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-pagar',
  templateUrl: './modal-pagar.component.html',
  styleUrls: ['./modal-pagar.component.scss']
})
export class ModalPagarComponent implements OnInit {

  @Input() valorTotal : number | undefined;
  @Input() valorPago: number | undefined;
  @Input() saldoDevedor: number | undefined;
  @Input() invoiceNumber: number | undefined;
  @Input() vat: number | undefined;
  @Input() nomeCliente: string | undefined;

  totalPayment : boolean = true;
  parcialPayment : boolean = false;

  today : Date = new Date();

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor() { }

  ngOnInit(): void {
  }

  optionTotalPayment(){
    this.totalPayment = true;
    this.parcialPayment = false;
  }
  optionParcialPayment(){
    this.parcialPayment = true;
    this.totalPayment = false;
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
  }

}
