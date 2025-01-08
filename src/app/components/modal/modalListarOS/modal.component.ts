import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { Console } from 'console';
import { Pagamento } from 'src/app/service/models/pagamento.model';

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
    ]),
    trigger('fadeBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
})
export class ModalComponent {
  @Input() status: string | undefined;
  @Input() id: number | undefined;
  @Input() nome: string | undefined;
  @Input() clientName: string | undefined;
  @Input() valorTotal: number | undefined;
  @Input() valorDaEntrada: number | undefined;
  @Input() creationDate: string | undefined;

  @Output() close = new EventEmitter<void>();

  orders : OrdemServico = {} as OrdemServico;

   // Objeto de controle para o estado de colapso
   detalheServicoCollapse: { [key: number]: boolean } = {};
  valorTotalDetalheServicoPorPlaca: {[key: string] : number} = {};

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
  valorTotalGeral : number = 0;
  dataUltimoPagamento: any = "14/09/2024";

  contadorRegistros: number = 0;

  groupedDetalheServico: any[] = [];

  isModalOpen : boolean = false;

  modalPagarOpen : boolean = false;

  constructor(private ordemServico : OrdemservicoService) {
  }

  ngOnInit(): void {
    this.getOrdemServicoById(this.id);
  }


  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
  }
  
  // Método para incluir uma nova moto
  incluirMoto() {
    this.motos.push({ placa: '', descricao: '', milhagem: '', preco: '', registros: [], isCollapsed: true });
  }

  get vat():string{
    return this.orders.vat === 0 ? null : this.orders.vat.toString();
  }
  set vat(value: string) {
    this.orders.vat = value === '' ? 0 : parseFloat(value);  // Converte para número ou 0 se vazio
  }

  trackById(index: number, registro: any): number {
    return registro.id;  // ou qualquer chave única que identifique cada item
  }

  // Função para agrupar ordens de serviço por placa
  groupByPlaca(detalhes: any[]) {
    const grouped = detalhes.reduce((groups, detalhe) => {
      const placa = detalhe.placa;
      if (!groups[placa]) {
        groups[placa] = [];
      }
      groups[placa].push(detalhe);
      return groups;
    }, {});
    
    // Converte o objeto de grupos em um array
    return Object.keys(grouped).map(placa => ({
      placa: placa,
      detalhes: grouped[placa]
    }));
  }

  getOrdemServicoById(idOrdemServico : number): void{
    this.ordemServico.getOrdemServicoById(idOrdemServico).subscribe(
      (ordemServico) => {
        this.orders = ordemServico;

        this.orders.detalheServico.forEach(detalheOs => {
          detalheOs.data = this.formatDate(detalheOs.data);
        });

        /*
        this.orders.detalheServico.forEach(detalhe => {
          // Inicializa a chave para cada id
          if (this.detalheServicoCollapse[detalhe.id] === undefined) {
            this.detalheServicoCollapse[detalhe.id] = true;  // Inicia como colapsado
          }
        });*/

        // Agrupar ordens de serviço por placa
        this.groupedDetalheServico = this.groupByPlaca(this.orders.detalheServico);

        this.calcularValorTotalDetalheServiçoPorPlaca();

        if (this.groupedDetalheServico.length === 1) {
          this.groupedDetalheServico.forEach(grupo => {
            this.detalheServicoCollapse[grupo.placa] = true;
          });
        };
      },
      (error) => {
        console.error("Erro ao encontrar ordem de serviço" + error);
      }
    )
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split(' ')[0].split('/');
    return `${day}/${month}/${year}`;
  }

   // Método para atualizar o motorista
   updateMotorista(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.groupedDetalheServico[index].motorista = input.value;
  }

  // Método para atualizar a observação
  updateObservacao(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.groupedDetalheServico[index].observacao = input.value;
  }

  // Método para atualizar a quantidade de um registro específico
  updateQuantidade(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].quantidade = input.value;
  }

  // Método para atualizar a descrição de um registro específico
  updateDescricao(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].descricao = input.value;
  }

  // Método para atualizar o valor de um registro específico
  updateValor(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].valor = input.value;
  }

  // Método para atualizar a milhagem de um registro específico
  updateMilhagem(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].milhagem = input.value;
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
  /*calcularSoma(moto: any): number {
    return moto.registros.reduce((acc: number, registro: any) => acc + (registro.qtd * registro.preco), 0);
  } */

  // Método para atualizar o valor final (considerando entrada)
  atualizarValorFinal(): number {
    return this.totalValue2 - this.valorEntrada;
  }

  calcularValorTotalDetalheServiçoPorPlaca(){
    for(let i = 0; i < this.groupedDetalheServico.length; i++ ){
      this.totalValue2 = 0;

      for(let j = 0; j < this.groupedDetalheServico[i].detalhes.length; j++){
        this.totalValue2 += this.groupedDetalheServico[i].detalhes[j].valor;
      }
      this.valorTotalDetalheServicoPorPlaca[this.groupedDetalheServico[i].placa] = this.totalValue2;
    }
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

  toggleCollapse(placa: string) {
    this.detalheServicoCollapse[placa] = !this.detalheServicoCollapse[placa];
  }

  openModalCliente() {
    this.isModalOpen = true;
    console.log("abrindo.");
    document.getElementById('modal-bellow-overlay')?.classList.add('show');

  }
  closedModal() {
    this.isModalOpen = false;
    this.modalPagarOpen = false;
    document.getElementById('modal-bellow-overlay')?.classList.remove('show');
  }

  openModalPagar(){
    this.modalPagarOpen = true;
    document.getElementById('modal-bellow-overlay')?.classList.add('show');
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
