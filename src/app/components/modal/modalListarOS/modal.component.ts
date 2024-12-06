import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';

@Component({
  selector: 'modal-listar-ordemServico',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ModalComponent {
  @Input() status: string | undefined;
  @Input() id: number | undefined;
  @Input() nome: string | undefined;
  @Input() clientName: string | undefined;
  @Input() valorTotal: number | undefined;
  @Input() valorDaEntrada: number | undefined;
  @Input() creationDate: string | undefined;

  orders : OrdemServico = {} as OrdemServico;

  constructor(private ordemServico : OrdemservicoService) { }

  ngOnInit(): void {
    console.log("id cliente? "+this.id);
    console.log(this.status);
    this.getOrdemServicoById(this.id);
  }

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
  }

  // Dados iniciais do formulário
  motos: any[] = [];  // Lista de motos
  motoCount: number = 0;
  valorEntrada: number = 0;
  pagamentoTipo: string = '';
  quantidadeParcelas: number = 0;
  dataAtualBR: string = new Date().toLocaleDateString('pt-BR'); // Data atual no formato BR
  observacao: string = '';
  totalValue2: number = 0;
  nInvoice: number = 0;
  vat : number = 333;
  valorTotalGeral : number = 0;
  dataUltimoPagamento: any = "14/09/2024";

  // Método para incluir uma nova moto
  incluirMoto() {
    this.motos.push({ placa: '', descricao: '', milhagem: '', preco: '', registros: [], isCollapsed: true });
  }

  getOrdemServicoById(idOrdemServico : number): void{
    this.ordemServico.getOrdemServicoById(idOrdemServico).subscribe(
      (ordemServico) => {
        this.orders = ordemServico;
        console.log("Invoice number: "+this.orders.invoiceNumber);
      },
      (error) => {
        console.error("Erro ao encontrar ordem de serviço" + error);
      }
    )
  }

  // Método para remover uma moto
  removerMoto(index: number) {
    this.motos.splice(index, 1);
  }

  // Método para incluir um novo registro para uma moto
  incluirRegistro(motoIndex: number) {
    this.motos[motoIndex].registros.push({ qtd: 0, descricao: '', preco: 0, milhagem: '', data: new Date().toLocaleDateString('pt-BR') });
  }

  // Método para remover um registro de uma moto
  removerRegistro(motoIndex: number, registroIndex: number) {
    this.motos[motoIndex].registros.splice(registroIndex, 1);
  }

  // Calcular a soma total de uma moto (exemplo)
  calcularSoma(moto: any): number {
    return moto.registros.reduce((acc: number, registro: any) => acc + (registro.qtd * registro.preco), 0);
  }

  // Método para atualizar o valor final (considerando entrada)
  atualizarValorFinal(): number {
    return this.totalValue2 - this.valorEntrada;
  }

  // Método para manipular o tipo de pagamento (à vista ou parcelado)
  onPagamentoChange(valor: string) {
    this.pagamentoTipo = valor;
  }

  // Método para atualizar o valor de entrada
  onValorEntradaChange() {
    // Lógica para garantir que o valor de entrada seja tratado corretamente
    if (isNaN(this.valorEntrada)) {
      this.valorEntrada = 0;
    }
  }

  // Método para enviar o formulário
  onSubmit() {
    console.log('Formulário enviado com os seguintes dados:');
    console.log('Cliente:', this.clientName);
    console.log('Status:', this.status);
    console.log('Valor Total:', this.valorTotal);
    console.log('Data de Criação:', this.creationDate);
    console.log('Motos:', this.motos);
    // Aqui você pode chamar um serviço para enviar esses dados a uma API, por exemplo
  }
}
