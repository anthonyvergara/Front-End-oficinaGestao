import {Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { Console } from 'console';
import { Pagamento } from 'src/app/models/pagamento.model';
import { Router } from '@angular/router';
import { ImpressaoService } from 'src/app/service/impressao/impressao.service';
import { SharedService } from 'src/app/service/shared/shared.service';
import { DetalheServico } from 'src/app/models/detalheServico.model';
import { DetalheServicoService } from 'src/app/service/detalheServico/detalhe-servico.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'modal-view-ordemServico',
  templateUrl: './modal-view-ordem.component.html',
  styleUrls: ['./modal-view-ordem.component.scss'],
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
export class ModalViewOrdemComponent {
  @Input() status: string | undefined;
  @Input() id: number | undefined;
  @Input() nome: string | undefined;
  @Input() clientName: string | undefined;
  @Input() valorTotal: number | undefined;
  @Input() valorDaEntrada: number | undefined;
  @Input() creationDate: string | undefined;

  @Output() close = new EventEmitter<void>();

  @ViewChildren('descricaoInput') descricaoInputs!: QueryList<ElementRef>;

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

  newRegisters = 0;
  originalPlaca: string = '';
  originalMotorista: string = '';
  originalObservacao: string = '';

  changeInput: boolean = false;

  observacaoFieldChange: boolean = false;
  originalObservacaoOrdemServico: string = '';

  showSuccessAlert : boolean = false
  showDangerAlert : boolean = false

  messageAlert : string = ""

  contadorRegistros: number = 0;

  groupedDetalheServico: any[] = [];

  isModalOpen : boolean = false;

  modalPagarOpen : boolean = false;

  modalPaymentHistory : boolean = false;

  isModalNegociarOpen : boolean = false;

  dadosCarregados: boolean = false;

  constructor(private ordemServico : OrdemservicoService, private router: Router, private impressaoService : ImpressaoService,
    private sharedService : SharedService, private detalheServicoService : DetalheServicoService) {
  }

  ngOnInit(): void {
    this.getOrdemServicoById(this.id);
    this.sharedService.paymentCompleted$.subscribe(() => {
      this.getOrdemServicoById(this.id);
      this.checkStatus();
    })
    console.log(this.id)
  }

  checkStatus(){
    this.status = this.orders.statusOrdemServico.tipoStatus
    return this.status;
  }

  extractTime(data: string){
    // Divide a string para separar a data da hora
    const [, time] = data.split(' ');

    // Retorna a hora, minuto e segundo
    return time;
  }

  convertToDateFormat(dateString: string): string {
    // Remove caracteres indesejados, como vírgulas
    dateString = dateString.replace(',', '');

    // Divide a string para separar a data da hora
    const [datePart] = dateString.split(' ');

    // Divide a data para pegar o dia, mês e ano
    const [day, month, year] = datePart.split('/');

    // Retorna a data no formato yyyy-mm-dd
    return `${year}-${month}-${day}`;
  }

  getValorTotal(): number {
    var total = Object.values(this.valorTotalDetalheServicoPorPlaca)
      .reduce((acc, curr) => acc + curr, 0);

    if (this.orders.vat != null || this.orders.vat != undefined || this.orders.vat != 0) {
      const vat = this.orders.vat / 100
      const sub_total = total * vat
      total = total + sub_total
    }

    return total;
  }

  ultimoPagamento() : string{
    var messagePagamento = "Ultimo pagamento feito "
    var messageSemPagamento =  "Nenhum pagamento foi realizado."
    if(this.orders.quantidadeParcelas == 0){
      const somenteData = this.orders.dataInicio.split(' ')[0];
      return messagePagamento += somenteData
    }

    if(this.orders.pagamento.length > 0){
      const pagamentos = this.orders.pagamento;
      const ultimo = pagamentos
          .slice()
          .sort((a, b) => {
            const dataA = this.parseDataPagamento(a.dataPagamento);
            const dataB = this.parseDataPagamento(b.dataPagamento);
            return dataB.getTime() - dataA.getTime(); // mais recente primeiro
          })[0];

      const somenteData = ultimo.dataPagamento.split(' ')[0];
      return messagePagamento+= somenteData
    }

    return messageSemPagamento
  }

  parseDataPagamento(dataStr: string): Date {
    const [data, hora] = dataStr.split(' ');
    const [dia, mes, ano] = data.split('/').map(Number);
    const [horaStr, minuto, segundo] = hora.split(':').map(Number);
    return new Date(ano, mes - 1, dia, horaStr, minuto, segundo);
  }


  convertToDate(dateString: string): Date {
    return new Date(dateString);
  }

  subtractDates(dateObj1: Date, dateObj2: Date): number {
    // Calculando a diferença em milissegundos
    const differenceInMillis = dateObj2.getTime() - dateObj1.getTime();

    // Convertendo para dias
    const differenceInDays = differenceInMillis / (1000 * 3600 * 24); // Convertendo milissegundos para dias

    return Math.abs(differenceInDays)
  }

  compareDate(data : string): boolean{

    if(data == null){
      return false
    }

    var today = new Date();
    var formattedDateToday = today.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    var timeToday = this.extractTime(formattedDateToday)
    var timeServico = this.extractTime(data)
    var dataHoje = this.convertToDateFormat(formattedDateToday)
    var dataServico = this.convertToDateFormat(data)

    const dateToday = this.convertToDate(dataHoje)
    const dateRegister = this.convertToDate(dataServico)


    if(dateToday > dateRegister){
      if(this.subtractDates(dateRegister, dateToday) == 1){
        if(timeToday < timeServico){
          return false
        }else{
          return true
        }
      }
      if(this.subtractDates(dateRegister, dateToday) > 1){
        return true
      }
    }
    return false
  }

  verificarReadonly(registro: any): boolean {
    // Defina aqui a condição em que o campo será readonly
    return registro.data < new Date().toISOString();  // Exemplo: data passada
  }

  successAlert(message : string){
    console.log("modal-component")
    this.messageAlert = message
    this.showSuccessAlert = true
    this.autoCloseAlert();
  }
  dangerAlert(message : string){
    this.messageAlert = message
    this.showDangerAlert = true
    this.autoCloseAlert();
  }

  valorTotalPago() : number {
    var valorTotalDePagamentos = 0

    this.orders.pagamento.forEach(pagamento => {
      valorTotalDePagamentos += pagamento.valorPago
    });

    return valorTotalDePagamentos
  }

  saldoDevedor() : number{
    return this.orders.valorTotal - this.valorTotalPago();
  }

  valorTotalView() : number{
    return this.orders.valorTotal;
  }

  autoCloseAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false; // Fecha o alerta de sucesso
      this.showDangerAlert = false;
      this.messageAlert = ""
    }, 5000); // 5000 milissegundos = 5 segundos
  }

  ngOnChanges(): void {
    if (this.isModalOpen) {
      this.getOrdemServicoById(this.id);
    }
  }

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
    this.isModalOpen = false;
    this.modalPagarOpen = false;
    this.isModalNegociarOpen = false;
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
  }

  checkRegistroEnter(event: KeyboardEvent, motoIndex: number, registroIndex: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.incluirRegistro(motoIndex);

      setTimeout(() => {
        const descricaoInputElements = this.descricaoInputs.toArray();
        const nextRegistroIndex = (registroIndex !== null ? registroIndex + 1 : this.motos[motoIndex].registros.length - 1);

        // Direciona o foco para o campo de descrição do novo registro
        if (nextRegistroIndex < descricaoInputElements.length) {
          descricaoInputElements[nextRegistroIndex].nativeElement.focus();
        }
      });

    }
  }

  // Método para incluir uma nova moto
  incluirMoto() {
    this.groupedDetalheServico.forEach((servico) => {
      this.detalheServicoCollapse[servico.placa] = false;
    });

    const novoGrupo = {
      placa: '',
      data: null,
      detalhes: [{
        id: 0,
        descricao: '',
        quantidade: 1,
        valor: 0.00,
        milhagem: 0,
        placa: '',
        observacao: '',
        nomeMotorista: '',
        data: null
      }]
    };
    this.groupedDetalheServico.push(novoGrupo);
    this.detalheServicoCollapse[novoGrupo.placa] = true; // collapse começa expandido
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

        // this.orders.detalheServico.forEach(detalheOs => {
        //   detalheOs.data = this.formatDate(detalheOs.data);
        // });

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
            this.detalheServicoCollapse[grupo.placa] = true; // INICIA COLLAPSE SE POSSUI MAIS QUE 1 MOTO
          });
        };

        this.originalMotorista = this.groupedDetalheServico[0].detalhes[0].nomeMotorista;
        this.originalObservacao = this.groupedDetalheServico[0].detalhes[0].observacao;
        this.originalObservacaoOrdemServico = this.orders.observacao;
        this.dadosCarregados = true;
      },
      (error) => {
        console.error("Erro ao encontrar ordem de serviço" + error);
        this.dadosCarregados = false;
      }
    )
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split(' ')[0].split('/');
    return `${day}/${month}/${year}`;
  }

   // Método para atualizar o motorista
   updateMotorista(grupo: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log("input", input.value);
    if (input.value != this.originalMotorista) {
      this.changeInput = true;
    }else{
      this.changeInput = false;
    }

    grupo.detalhes[0].nomeMotorista = input.value;
  }

  updateFieldObservacaoOrdemServico(event: Event): void {
    const textArea = event.target as HTMLTextAreaElement;
    if(this.originalObservacaoOrdemServico != textArea.value) {
      this.observacaoFieldChange = true
    }else{
      this.observacaoFieldChange = false;
    }
  }

  // Método para atualizar a observação
  updateObservacao(grupo: any, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value != this.originalObservacao) {
      this.changeInput = true;
    }else{
      this.changeInput = false;
    }

    grupo.detalhes[0].observacao = input.value;
  }

  // Método para atualizar a quantidade de um registro específico
  updateQuantidade(grupo: any, index: number, event: Event): void {
    this.changeInput = true;
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].quantidade = input.value;
  }

  // Método para atualizar a descrição de um registro específico
  updateDescricao(grupo: any, index: number, event: Event): void {
    this.changeInput = true;
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].descricao = input.value;
  }

  // Método para atualizar o valor de um registro específico
  updateValor(grupo: any, index: number, event: any): void {
    const inputElement = event.target;
    const novoValor = parseFloat(inputElement.value.replace(/[^0-9.]/g, '')) || 0;

    // Atualiza o valor no modelo
    grupo.detalhes[index].valor = novoValor;

    // Recalcula os totais
    this.calcularTotais();
  }

  capturarPlaca(event: any, grupo: any) {
    const placaAntiga = grupo.placa;  // guarda a placa antiga
    const novaPlaca = event.target.value;

    // Atualiza a placa do grupo
    grupo.placa = novaPlaca;
    grupo.detalhes[0].placa = novaPlaca;
    // Se existir estado para a placa antiga, transfere para a nova placa
    if (this.detalheServicoCollapse[placaAntiga] !== undefined) {
      this.detalheServicoCollapse[novaPlaca] = this.detalheServicoCollapse[placaAntiga];
      delete this.detalheServicoCollapse[placaAntiga];
    }
  }


  atualizarPlaca(index: number, novaPlaca: string) {
    const grupo = this.groupedDetalheServico[index];
    const placaAntiga = grupo.placa;

    // Atualiza a placa no grupo
    grupo.placa = novaPlaca;

    // Se já havia uma entrada com a placa antiga, copia o estado
    if (this.detalheServicoCollapse[placaAntiga] !== undefined) {
      this.detalheServicoCollapse[novaPlaca] = this.detalheServicoCollapse[placaAntiga];
      delete this.detalheServicoCollapse[placaAntiga];
    } else {
      this.detalheServicoCollapse[novaPlaca] = true;
    }
  }


  formatarValorEmTempoReal(event: any, grupo: any, index: number): void {
    const inputElement = event.target;

    // Remove caracteres não numéricos
    let valor = inputElement.value.replace(/[^\d]/g, '');

    // Se o valor estiver vazio, define como "0"
    if (valor === '') {
      valor = '0';
    }

    // Converte para número inteiro (em centavos) e formata
    const numValue = parseInt(valor, 10);
    const formattedValue = this.formatarComoMoeda(numValue);

    // Atualiza o valor formatado no campo de input
    inputElement.value = formattedValue;

    // Atualiza o modelo com o valor em formato monetário (dividido por 100)
    grupo.detalhes[index].valor = numValue / 100;

    // Recalcula os totais
    this.calcularTotais();
  }

  onPrecoChange(){
    this.calcularTotais();
  }

  private formatarComoMoeda(value: number): string {
    const finalValue = value / 100; // Converte para valor monetário
    return '£ ' + finalValue.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }


  getDate() : string{
    return this.formatDate(this.orders.dataInicio);
  }

  // Método para atualizar a milhagem de um registro específico
  updateMilhagem(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].milhagem = input.value;
  }

  // Método para remover uma moto
  removerMoto(grupoIndex: number) {
    this.changeInput = true;
    this.groupedDetalheServico.splice(grupoIndex, 1);
    this.calcularTotais();
  }

  // Método para incluir um novo registro para uma moto
  incluirRegistro(grupoIndex: number) {
    this.newRegisters++;
    // Verifica se o grupo existe e adiciona um novo registro
    const grupo = this.groupedDetalheServico[grupoIndex];
    console.log("GRUPO INDEX: "+grupoIndex);
    console.log("GRUPO EXISTENTE: "+grupo)
    console.log("PLACA GRUPO EXISTENTE: "+grupo.placa)
    if (grupo) {
      const novoRegistro = {
        id: 0,
        descricao: '',
        quantidade: 1,
        valor: 0.00,
        milhagem: 0,
        placa: grupo.placa,
        observacao: grupo.observacao,
        nomeMotorista: grupo.motorista,
        data: grupo.data
      };

      grupo.detalhes.push(novoRegistro);

      this.calcularTotais();
    }
  }

  calcularTotais() {
    this.valorTotalDetalheServicoPorPlaca = {};

    this.groupedDetalheServico.forEach((grupo) => {
      const total = grupo.detalhes.reduce((acc, registro) => {
        const valor = parseFloat(registro.valor) || 0; // Converta para número, tratando NaN
        return acc + valor;
      }, 0);

      this.valorTotalDetalheServicoPorPlaca[grupo.placa] = total;
    });
  }

  onPrecoInput(event: Event, grupo: any, j: number): void {
    this.changeInput = true;
    const input = event.target as HTMLInputElement;
    const caretPos = input.selectionStart || 0;
    const originalLen = input.value.length;

    grupo.detalhes[j].valor = this.formatCurrency(input.value);

    setTimeout(() => {
      const updatedLen = grupo.detalhes[j].valor.length;
      const newCaretPos = updatedLen - originalLen + caretPos;
      input.setSelectionRange(newCaretPos, newCaretPos);
    });
  }

  onPrecoBlur(grupo: any, j: number): void {
    const valorFormatado = this.formatCurrency(grupo.detalhes[j].valor, true);
    // Extrair o valor numérico da string formatada
    const valorNumerico = parseFloat(valorFormatado.replace(/[^\d.]/g, ''));
    grupo.detalhes[j].valor = isNaN(valorNumerico) ? 0 : parseFloat(valorNumerico.toFixed(2)); // Mantém 2 decimais

    this.calcularTotais();
  }



  formatNumber(value: string): string {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatCurrency(value: string, blur: boolean = false): string {
    if (!value) return "";

    let numberValue = value.replace(/[^\d.]/g, ""); // remove tudo que não é número ou ponto

    if (numberValue.indexOf(".") >= 0) {
      const decimalPos = numberValue.indexOf(".");
      let left = numberValue.substring(0, decimalPos);
      let right = numberValue.substring(decimalPos + 1);

      left = this.formatNumber(left);
      right = right.replace(/\D/g, ""); // só números na parte decimal

      if (blur) {
        right = right.padEnd(2, "0"); // preenche com zeros até 2 casas decimais
      } else {
        right = right.substring(0, 2); // limita a 2 casas decimais durante digitação
      }

      return "£" + left + "." + right;
    } else {
      // sem ponto decimal
      numberValue = this.formatNumber(numberValue);
      return blur ? "£" + numberValue + ".00" : "£" + numberValue;
    }
  }

  onMilhasInput(event: Event, grupo: any, j: number): void {
    this.changeInput = true;
    const input = event.target as HTMLInputElement;
    const caretPos = input.selectionStart || 0;
    const originalLen = input.value.length;

    grupo.detalhes[j].milhagem = this.formatMilhas(input.value);

    setTimeout(() => {
      const updatedLen = grupo.detalhes[j].milhagem.length;
      const newCaretPos = updatedLen - originalLen + caretPos;
      input.setSelectionRange(newCaretPos, newCaretPos);
    });
  }

  onMilhasBlur(grupo: any, j: number): void {
    grupo.detalhes[j].milhagem = this.formatMilhas(grupo.detalhes[j].milhagem, true);
  }

  formatMilhasNumber(value: string): string {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatMilhas(value: string, blur: boolean = false): string {
    if (!value) return "";

    if (value.indexOf(".") >= 0) {
      const decimalPos = value.indexOf(".");
      let left = value.substring(0, decimalPos);
      left = this.formatMilhasNumber(left);
      return left + ".";
    } else {
      value = this.formatMilhasNumber(value);
      return blur ? value : value;
    }
  }




  atualizarOrdemServico(): DetalheServico[] {
    // Cria um array vazio onde você vai armazenar os detalhes extraídos
    let detail: DetalheServico[] = [];

    console.log("Ira iterar")
    console.log(this.groupedDetalheServico)
    // Itera sobre cada moto no array `groupedDetalheServico`
    this.groupedDetalheServico.forEach(moto => {
      // Itera sobre os detalhes de cada moto
      moto.detalhes.forEach(detalhe => {
        // Adiciona o detalhe extraído no array `detail`
        console.log(detalhe.data)
        detail.push({
          id: detalhe.id,
          data: detalhe.data,
          descricao: detalhe.descricao,
          placa: detalhe.placa,
          valor: detalhe.valor || 0,
          milhagem: parseFloat((detalhe.milhagem ?? 0).toString().replace(/[^\d]/g, "")) || 0, // Adiciona outros campos que deseja
          quantidade: detalhe.quantidade,
          observacao: detalhe.observacao,
          nomeMotorista: detalhe.nomeMotorista,
        });
      });
    });

    // Imprime o array de detalhes no console
    console.log("Iterado final")
    console.log(detail);

    // Aqui você pode retornar o array 'detail' ou um outro valor que faça sentido
    // Exemplo de retorno de um detalhe específico ou algum outro comportamento
    return detail;  // Apenas como exemplo, retornando o primeiro item de 'detail'
  }

  updateDetalheServico() : void{

    console.log("id Ordem: "+  this.orders.id)

    if (this.observacaoFieldChange == true){

      const ordemServico: OrdemServico = {
        id: this.orders.id,
        invoiceNumber: null,
        vat: null,
        dataInicio: null,
        valorTotal: null,
        tipoPagamento: null,
        observacao: this.orders.observacao,
        quantidadeParcelas: null,
        detalheServico: null,
        pagamento: null,
        statusOrdemServico: null,
        parcela: null,
        cliente: null
      };

      this.ordemServico.updateFieldOrdemServico(ordemServico,String(this.orders.cliente.id), "2").subscribe(
        response => {
          this.successAlert("Ordem de serviço atualizada com sucesso!");
          this.sharedService.notifyPaymentCompleted();
        },
        error => {
          this.dangerAlert("Erro ao atualizar ordem de serviço")
          // console.error('Erro ao atualizar ordem de serviço', error);
        }
      );
    }

    if (this.changeInput == true || this.newRegisters > 0 ) {
      console.log("DETALHES DE MOTOS A SEREM ATUALIZADAS")
      console.log(this.atualizarOrdemServico());
      this.detalheServicoService.putDetalheServico(this.orders.id, this.atualizarOrdemServico()).subscribe(
        response => {
          this.successAlert("Ordem de serviço atualizada com sucesso!");
          this.sharedService.notifyPaymentCompleted();
        },
        error => {
          this.dangerAlert("Erro ao atualizar ordem de serviço")
          // console.error('', error);
        }
      );
    }

    this.newRegisters = 0;
    this.changeInput = false;
    this.observacaoFieldChange = false;
  }


  // Método para remover um registro de uma moto
  removerRegistro(grupoIndex: number, registroIndex: number) {
    this.newRegisters--;
    if (this.newRegisters < 0) {
      this.changeInput = true;
    }
    const grupo = this.groupedDetalheServico[grupoIndex];
    if (grupo && grupo.detalhes && grupo.detalhes.length > 0) {
      // Remove o registro do grupo pelo índice
      grupo.detalhes.splice(registroIndex, 1);
      this.calcularTotais();
    }
    console.log("Remvoveu")
    console.log(this.groupedDetalheServico)
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
  openModalPaymentHistory(){
    this.modalPaymentHistory = true;
    document.getElementById('modal-bellow-overlay')?.classList.add('show');
  }
  closedModal() {
    this.isModalOpen = false;
    this.modalPaymentHistory = false;
    this.modalPagarOpen = false;
    this.isModalNegociarOpen = false;
    document.getElementById('modal-bellow-overlay')?.classList.remove('show');
  }

  openModalPagar(){
    this.modalPagarOpen = true;
    document.getElementById('modal-bellow-overlay')?.classList.add('show');
  }

  openModalNegociar(){
    this.isModalNegociarOpen = true;
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

  // imprimir() {
  //   const url = '../../../../assets/print/invoice.html';
  //   window.open(url, '_blank');
  // }

  imprimir() {
    const printWindow = window.open('', '_blank');

    // Agrupar os serviços por placa
    const servicosPorPlaca = {};

    this.orders.detalheServico.forEach((servico) => {
      const placa = servico.placa;
      if (!servicosPorPlaca[placa]) {
        servicosPorPlaca[placa] = [];
      }
      servicosPorPlaca[placa].push(servico);
    });

// Gerar HTML agrupado
    let itemsHtml = '';

    Object.keys(servicosPorPlaca).forEach((placa) => {
      const servicos = servicosPorPlaca[placa];

      // Adiciona linha de separação com a placa apenas uma vez
      itemsHtml += `
    <tr>
      <td colspan="3"><strong>Placa: ${placa}</strong></td>
    </tr>
  `;

      servicos.forEach((servico) => {
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(servico.valor);
        const capitalizedDescription = servico.descricao.charAt(0).toUpperCase() + servico.descricao.slice(1);

        itemsHtml += `
      <tr style="margin-left: 10px">
        <td class="description">${capitalizedDescription}</td>
        <td class="hours text-center">${servico.quantidade}</td>
        <td class="amount text-center">${formattedAmount}</td>
      </tr>
    `;
      });
    });


    var today: Date = new Date();

    // Array com os nomes dos meses
    var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Obter o mês atual (getMonth retorna 0 para Janeiro, 1 para Fevereiro, etc.)
    var month = monthNames[today.getMonth()];
    // Obter o dia e o ano
    var day = today.getDate();
    var year = today.getFullYear();

    // Adicionar zero à esquerda no dia, se necessário
    if (day < 10) day = Number('0') + day;

    // Montar a data no formato dd/MM/YYYY com o nome do mês
    var formattedDateWithMonthName = `${day} ${month} ${year}`;

    var valot_total_sem_vat= Object.values(this.valorTotalDetalheServicoPorPlaca)
      .reduce((acc, curr) => acc + curr, 0);

    var vat = this.orders.vat
    var vatValueNumber = valot_total_sem_vat * (vat / 100);
    var vatValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(vatValueNumber);
    var valorTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(valot_total_sem_vat + vatValueNumber);

    var subTotalNumber = this.orders.valorTotal - vatValueNumber;
    var subTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(subTotalNumber);




    if (printWindow) {
        // Renderizar o template HTML com as informações
        printWindow.document.write(`
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice № ${this.orders.invoiceNumber}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../../../assets/print/style.css">
</head>
<body>
<div class="main-content container">
<div class="row invoice">
  <div class="col-md-3 invoice-aside">
    <div class="invoice-logo">
        <img src="../../../../assets/img/brand/CARECA_LOGO.WEBP" alt="Logo" class="print-logo">
    </div>
    <div class="invoice-data">
        <!--
      <div class="invoice-person mt-2">
        <span class="name">INVOICE</span>
        <span class="position">Developer and Designer</span>
        <span><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="7b1f141515023b1f1e08121c151e09551814">[email&#160;protected]</a></span>
        <span>661 Bubby Street</span>
        <span>United States</span>
      </div>
        -->
      <div class="invoice-payment-direction"><i class="icon s7-angle-down-circle"></i></div>
      <!--
      <div class="invoice-person"><span class="name">Elliot Mark</span><span class="position">CEO at BLX</span><span><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="4122242e232d3901222e2c31202f386f222e">[email&#160;protected]</a></span><span>839 Owagner Drive</span><span>United States</span></div>
      -->
      <div class="invoice-company-info">
        <div class="summary">
         <!-- <span class="title">MOTO HACKNEY LIMITED</span>-->
          <p><strong>Company N:</strong> 10689065</p>
          <p><strong>VAT Reg N:</strong> 336345208</p>
          <span class="title mt-5">ADDRESS</span>
          <p>38 Crawley Road</p>
          <p>London</p>
          <p>N22 6AG</p>
          <p>United Kingdom</p>
        </div>

        <div class="summary mt-5">
            <span class="title">CONTACT</span>
            <div class="phone">
                <ul class="list-unstyled">
                  <li>+44 02088884733</li>
                  <!--<li>+1(656)-3558302</li>-->
                </ul>
              </div>
        </div>

        <!--<div class="phone">
          <ul class="list-unstyled">
            <li>+1(535)-8999278</li>
            <li>+1(656)-3558302</li>
          </ul>
        </div>-->
        <div class="email">
          <ul class="list-unstyled">
            <li><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="9af7fbf3e9f5f4ffeeeeffdaf9f5f7eafbf4e3b4f9f5">[email&#160;protected]</a></li>
           <!-- <li><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="dbb6bab2a8b4b5beafafbe9ba8aeababb4a9aff5b8b4">[email&#160;protected]</a></li>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-9 invoice-content">
    <div class="row invoice-header">
      <div class="col-6 invoice-title"><p>MTH</p><span>MOTO HACKNEY LIMITED</span></div>
      <div class="col-6 invoice-order">
        <span class="invoice-number"></span>
        <p class="invoice-date">Company N: 10689065</p>
        <span class="invoice-date">${formattedDateWithMonthName}</span>
        <!--<p class="invoice-date">Invoice № ${this.orders.invoiceNumber}</p>-->
        </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="invoice-details">
          <thead>
            <tr>
              <th style="width:60%">Description</th>
              <th class="hours text-center" style="width:17%">Qty</th>
              <th class="amount text-center" style="width:15%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <table class="invoice-summary">
          <thead>
            <tr>
              <th>Subtotal</th>
              <th>VAT (${vat}%)</th>
              <th class="total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="amount">${subTotal}</td>
              <td class="amount">${vatValue}</td>
              <td class="amount total-value">${valorTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--<div class="row">
      <div class="col-md-12">
        <div class="invoice-payment-details">
          <p><b>Payment Method:</b> Credit card</p>
          <p><b>Card type:</b> Mastercard</p>
          <p><b>Number verification:</b> 4256981387</p>
        </div>
      </div>
    </div>-->
    <div class="row">
      <div class="col-md-12 invoice-message mt-5 mb-5 mt-sm-6 mb-sm-6"><span class="title mb-4">Thank you for contacting us!</span>
        <p></p>
      </div>
    </div>
    <div class="row invoice-footer">
      <div class="col-md-12">
      </div>
    </div>
  </div>
</div>
</div>
<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript">
    window.onload = function() {
        window.print();
    };
</script>
</body>
</html>
        `);
        printWindow.document.close(); // Necessário para carregar o conteúdo

    }
}


  // imprimir() {
  //   this.impressaoService.setOrdemServico(this.orders)
  //   this.router.navigate(['/impressao']);

  //   /* Abre uma nova janela ou aba com uma URL absoluta
  //   const novaJanela = window.open('', '_blank');  // Abre uma nova aba

  //   if (novaJanela) {
  //     // Navegar para a rota de impressão. Aqui usamos a URL com #.
  //     novaJanela.location.href = `${window.location.origin}/#impressao`;
  //   } */
  // }
}
