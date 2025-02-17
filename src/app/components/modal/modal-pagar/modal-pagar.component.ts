import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { Pagamento } from 'src/app/service/models/pagamento.model';
import { PagamentoService } from 'src/app/service/pagamento/pagamento.service';
import { SharedService } from 'src/app/service/shared/shared.service';

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

  pagamento : Pagamento[];

  totalPayment : boolean = true;
  parcialPayment : boolean = false;
  precoParcial : string;

  valorTotalAhPagar : number = 0; 
  valorParcialAhPagar : number = 0;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  isModalOpen: boolean = false
  isModalConfirmOpen : boolean = false

  message : string = ""

  today : Date = new Date();
  
  @Output() successAlert = new EventEmitter<void>(); 
  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor(private pagamentoService: PagamentoService, private sharedService: SharedService) { }

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
    console.log(this.valorParcialAhPagar)
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

  pagar(){
    const idOrdemServico = this.ordemServico.id; // Substitua pelo ID real da ordem de serviço
    const pagamentos: Pagamento[] = [
      { valorPago: this.valorTotalAhPagar }
    ];

    this.pagamentoService.postPayOrdemServico(pagamentos, String(idOrdemServico)).subscribe(
      response => {
        console.log('Pagamentos salvos com sucesso:', response);
        this.sharedService.notifyPaymentCompleted();
      },
      error => {
        console.error('Erro ao salvar pagamentos:', error);
        this.showDangerAlert = true;
      }
    );
  };

  successAlertShow(){
    console.log("alert")
    this.successAlert.emit();
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
    this.isModalOpen = false
    console.log("emitiu")
  }

  closeModalConfirm(){
    this.isModalConfirmOpen = false
  }

  openModalConfirm() {
    this.isModalConfirmOpen = true;
    this.message = "Você realmente deseja efetuar o pagamento?"
    console.log("abrindo.");
    document.getElementById('modal-bellow-overlay')?.classList.add('show');

  }

}
