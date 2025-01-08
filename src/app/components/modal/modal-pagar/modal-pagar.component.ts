import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';

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
  @Input() ordemServico: OrdemServico | undefined;

  totalPayment : boolean = true;
  parcialPayment : boolean = false;
  precoParcial : string;

  valorTotalAhPagar : number = 0;
  valorParcialAhPagar : number = 0;

  today : Date = new Date();

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor() { }

  ngOnInit(): void {
    this.valorTotalAhPagar = this.saldoDevedor;
  }

  valorTotalAtrasado() : number{
    let valorTotalAtrasado: number = 0;

    this.ordemServico.parcela.forEach(parcela => {
      if(parcela.statusParcela == "ATRASADO"){
        valorTotalAtrasado += parcela.valorParcela;
      }
    })

    return valorTotalAtrasado;
  }

  proximaParcela() : string{
    return this.ordemServico.statusOrdemServico.proximoVencimento;
  }

  onPrecoParcialChange(){
    this.valorParcialAhPagar = parseFloat(this.precoParcial.replace(/[^\d]/g, "")) / 100 || 0;
    this.valorTotalAhPagar = this.valorParcialAhPagar;
  }

  optionTotalPayment(){
    this.totalPayment = true;
    this.parcialPayment = false;

    this.valorTotalAhPagar = this.saldoDevedor;
  }
  optionParcialPayment(){
    this.parcialPayment = true;
    this.totalPayment = false;

    this.valorTotalAhPagar = this.valorParcialAhPagar;
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
  }

}
