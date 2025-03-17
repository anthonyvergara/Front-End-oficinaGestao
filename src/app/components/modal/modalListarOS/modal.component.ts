import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { Console } from 'console';
import { Pagamento } from 'src/app/service/models/pagamento.model';
import { Router } from '@angular/router';
import { ImpressaoService } from 'src/app/service/impressao/impressao.service';
import { SharedService } from 'src/app/service/shared/shared.service';
import { DetalheServico } from 'src/app/service/models/detalheServico.model';
import { DetalheServicoService } from 'src/app/service/detalheServico/detalhe-servico.service';

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

  showSuccessAlert : boolean = false
  showDangerAlert : boolean = false

  messageAlert : string = ""

  contadorRegistros: number = 0;

  groupedDetalheServico: any[] = [];

  isModalOpen : boolean = false;

  modalPagarOpen : boolean = false;

  isModalNegociarOpen : boolean = false;

  constructor(private ordemServico : OrdemservicoService, private router: Router, private impressaoService : ImpressaoService, 
    private sharedService : SharedService, private detalheServicoService : DetalheServicoService) {
  }

  ngOnInit(): void {
    this.getOrdemServicoById(this.id);
    this.sharedService.paymentCompleted$.subscribe(() => {
      this.getOrdemServicoById(this.id);
      this.checkStatus();
    })
  }

  checkStatus(){  
    this.status = this.orders.statusOrdemServico.tipoStatus
    return this.status;
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
    return this.valorTotal - this.valorTotalPago();
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
  
  // Método para incluir uma nova moto
  incluirMoto() {
    const novoGrupo = {
      placa: 'NOVA_PLACA',  // A placa pode ser dinâmica ou deixada para o usuário preencher
      detalhes: []
    };
    this.groupedDetalheServico.push(novoGrupo);
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
  updateValor(grupo: any, index: number, event: any): void {
    const inputElement = event.target;
    const novoValor = parseFloat(inputElement.value.replace(/[^0-9.]/g, '')) || 0;
  
    // Atualiza o valor no modelo
    grupo.detalhes[index].valor = novoValor;
  
    // Recalcula os totais
    this.calcularTotais();
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
  
  private formatarComoMoeda(value: number): string {
    const finalValue = value / 100; // Converte para valor monetário
    return '£ ' + finalValue.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  
  

  // Método para atualizar a milhagem de um registro específico
  updateMilhagem(grupo: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    grupo.detalhes[index].milhagem = input.value;
  }

  // Método para remover uma moto
  removerMoto(grupoIndex: number) {
    this.groupedDetalheServico.splice(grupoIndex, 1);
  }

  // Método para incluir um novo registro para uma moto
  incluirRegistro(grupoIndex: number) {
    // Verifica se o grupo existe e adiciona um novo registro
    const grupo = this.groupedDetalheServico[grupoIndex];
    if (grupo) {
      const novoRegistro = {
        id:0,
        descricao: '',
        quantidade: 1,
        valor: 0.00,
        milhagem: 0,
        placa: grupo.placa,
        data: new Date().toLocaleDateString('pt-BR')  // Pode ser substituído com outra lógica para data
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


  atualizarOrdemServico(): DetalheServico[] {
    // Cria um array vazio onde você vai armazenar os detalhes extraídos
    let detail: DetalheServico[] = [];
  
    // Itera sobre cada moto no array `groupedDetalheServico`
    this.groupedDetalheServico.forEach(moto => {
      // Itera sobre os detalhes de cada moto
      moto.detalhes.forEach(detalhe => {
        // Adiciona o detalhe extraído no array `detail`
        detail.push({
          id: detalhe.id, 
          data: null,
          descricao: detalhe.descricao,
          placa: detalhe.placa,
          valor: detalhe.valor || 0,
          milhagem: detalhe.milhagem || 0, // Adiciona outros campos que deseja
          quantidade: detalhe.quantidade
        });
      });
    });
  
    // Imprime o array de detalhes no console
    console.log(detail);
  
    // Aqui você pode retornar o array 'detail' ou um outro valor que faça sentido
    // Exemplo de retorno de um detalhe específico ou algum outro comportamento
    return detail;  // Apenas como exemplo, retornando o primeiro item de 'detail'
  }
  
  updateDetalheServico() : void{
    console.log("id Ordem: "+  this.orders.id)
    this.detalheServicoService.putDetalheServico(this.orders.id, this.atualizarOrdemServico()).subscribe(
      response => {
        console.log('Ordem de serviço atualizada com sucesso!', response);
        //this.sharedService.notifyPaymentCompleted();
      },
      error => {
        console.error('Erro ao atualizar ordem de serviço', error);
      }
    )
  }
  

  // Método para remover um registro de uma moto
  removerRegistro(grupoIndex: number, registroIndex: number) {
    const grupo = this.groupedDetalheServico[grupoIndex];
    if (grupo && grupo.detalhes && grupo.detalhes.length > 0) {
      // Remove o registro do grupo pelo índice
      grupo.detalhes.splice(registroIndex, 1);
      this.calcularTotais();
    }
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

    let itemsHtml = '';
    this.orders.detalheServico.forEach((servico) => {
      // Formatando o valor para o formato moeda padrão dos EUA
      const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(servico.valor);
  
      // Capitalizando a primeira letra da descrição
      const capitalizedDescription = servico.descricao.charAt(0).toUpperCase() + servico.descricao.slice(1);
  
      // Adicionando os itens formatados ao HTML
      itemsHtml += `
          <tr>
              <td class="description">${capitalizedDescription}</td>
              <td class="hours text-center">${servico.quantidade}</td>
              <td class="amount text-center">${formattedAmount}</td>
          </tr>
      `;
    });

    var today: Date = new Date();

    // Array com os nomes dos meses
    var monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Obter o mês atual (getMonth retorna 0 para Janeiro, 1 para Fevereiro, etc.)
    var month = monthNames[today.getMonth()];

    // Obter o dia e o ano
    var day = today.getDate();
    var year = today.getFullYear();

    // Adicionar zero à esquerda no dia, se necessário
    if (day < 10) day = Number('0') + day;

    // Montar a data no formato dd/MM/YYYY com o nome do mês
    var formattedDateWithMonthName = `${day} de ${month} de ${year}`;

    var vat = this.orders.vat
    var vatValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(this.orders.valorTotal * vat);
    var valorTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(this.orders.valorTotal + (this.orders.valorTotal * vat));
    var subTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(this.orders.valorTotal);
  
    
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
                  <li>+1(535)-8999278</li>
                  <li>+1(656)-3558302</li>
                </ul>
              </div>
        </div>

        <div class="phone">
          <ul class="list-unstyled">
            <li>+1(535)-8999278</li>
            <li>+1(656)-3558302</li>
          </ul>
        </div>
        <div class="email">
          <ul class="list-unstyled">
            <li><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="9af7fbf3e9f5f4ffeeeeffdaf9f5f7eafbf4e3b4f9f5">[email&#160;protected]</a></li>
            <li><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="dbb6bab2a8b4b5beafafbe9ba8aeababb4a9aff5b8b4">[email&#160;protected]</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-9 invoice-content">
    <div class="row invoice-header">
      <div class="col-6 invoice-title"><span>MOTO HACKNEY LIMITED</span></div>
      <div class="col-6 invoice-order"><span class="invoice-number"></span><span class="invoice-date">${formattedDateWithMonthName}</span></div>
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
    <div class="row">
      <div class="col-md-12">
        <div class="invoice-payment-details">
          <p><b>Payment Method:</b> Credit card</p>
          <p><b>Card type:</b> Mastercard</p>
          <p><b>Number verification:</b> 4256981387</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 invoice-message mt-5 mb-5 mt-sm-6 mb-sm-6"><span class="title mb-4">Thank you for contacting us!</span>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis massa nisl. Sed fringilla turpis id mi ultrices, et faucibus ipsum aliquam.</p>
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
