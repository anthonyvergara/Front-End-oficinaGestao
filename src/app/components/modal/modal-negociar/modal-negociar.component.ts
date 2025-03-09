import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { ParcelamentoService } from 'src/app/service/parcelamento/parcelamento.service';
import { SharedService } from 'src/app/service/shared/shared.service';

@Component({
  selector: 'app-modal-negociar',
  templateUrl: './modal-negociar.component.html',
  styleUrls: ['./modal-negociar.component.scss']
})
export class ModalNegociarComponent implements OnInit {
  @Input() ordemServico: OrdemServico | undefined;

  @Output() successAlert = new EventEmitter<string>(); 
  @Output() dangerAlert = new EventEmitter<string>(); 

  // Array de opções para o <select>
  selectOptions: { value: string, label: string }[] = [];
  installmentsValues : string[] = [];

  selectedValue: string = '';  // Variável que armazena o valor selecionado

  nomeCliente : string
  saldoDevedor : number;
  today : Date = new Date();
  invoiceNumber : number
  saldoAtrasado : number = 0;
  saldoCalculado : boolean = false;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;
  
  isModalConfirmOpen : boolean = false
  message : string = ""

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  constructor(private ParcelamentoService : ParcelamentoService, private sharedService : SharedService) { }

  ngOnInit(): void {
    this.getOrdemServico();
    this.getSaldoAtrasado();
    this.inputSelectValues();
  }

  inputSelectValues(){
    this.calculeInstallmentsValues();

    for (let i: number = 0; i < 10; i++) {
      this.selectOptions.push({
        value: `${i + 1}`,  // Adicionando um valor único para cada opção
        label: `${i + 1} Parcelas de £${this.installmentsValues[i]}`   // Adicionando um rótulo (label) para cada opção
      });
    }
    // Atribui um valor inicial ao select (opcional)
    this.selectedValue = this.selectOptions[0]?.value;
  }

  calculeInstallmentsValues(){
    for (let i = 0; i < 10; i++){
      var parcelValue = this.saldoDevedor / (i + 1)
      let formattedValue = parcelValue.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      this.installmentsValues[i] = formattedValue
    }
  }

  closedModal() {
    this.close.emit();  // Emite evento para o componente pai
    this.saldoCalculado = false;
  }

  closeModalConfirm(){
    this.isModalConfirmOpen = false
  }

  getOrdemServico() : void{
    this.nomeCliente = this.ordemServico.cliente.nome
    this.saldoDevedor = this.ordemServico.statusOrdemServico.saldoDevedor
    this.invoiceNumber = this.ordemServico.invoiceNumber
  }

  getSaldoAtrasado() : number{
    this.ordemServico.parcela.forEach((parcela) => {
      if(parcela.statusParcela == "ATRASADO" && this.saldoCalculado == false){
        this.saldoAtrasado += parcela.valorParcela
      }
    })
    this.saldoCalculado = true
    console.log(this.saldoAtrasado + "ATRASADAO")
    console.log(this.selectedValue)
    return this.saldoAtrasado
  }

  dangerAlertShow(){
    console.log("oi")
    this.dangerAlert.emit("Não foi possivel efetuar a negociação!");
  }
  successAlertShow(){
    this.successAlert.emit("Negociação efetuada com sucesso!");
  }

  negociar(){
    const idOrdemServico = this.ordemServico.id;
    const numParcelas = this.selectedValue

    this.ParcelamentoService.putParcelamento(idOrdemServico, Number(numParcelas)).subscribe(
      (response) =>{
        this.sharedService.notifyPaymentCompleted();
        this.successAlertShow();
        this.closedModal();
      },
      (error) => {
        this.dangerAlertShow();
        this.closedModal();
      }
    )
  }

  openModalConfirm() {
    this.isModalConfirmOpen = true;
    this.message = "Você realmente deseja efetuar a negociação?"
    console.log("abrindo.");
    document.getElementById('modal-bellow-overlay')?.classList.add('show');

  }

}
