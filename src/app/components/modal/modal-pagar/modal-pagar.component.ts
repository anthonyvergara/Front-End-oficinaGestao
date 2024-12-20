import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-pagar',
  templateUrl: './modal-pagar.component.html',
  styleUrls: ['./modal-pagar.component.scss']
})
export class ModalPagarComponent implements OnInit {

  totalPayment : boolean = true;
  parcialPayment : boolean = false;

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
