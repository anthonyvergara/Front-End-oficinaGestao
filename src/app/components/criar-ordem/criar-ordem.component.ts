import { Component, OnInit, QueryList, ViewChildren, ElementRef, ViewChild, HostListener } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { OrdemServico } from 'src/app/models/ordemServico.model';
import { NgForm } from '@angular/forms';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { firstValueFrom } from 'rxjs';

import {Cliente} from '../../models/cliente.model';

@Component({
  selector: 'app-criar-ordem',
  templateUrl: './criar-ordem.component.html',
  styleUrls: ['./criar-ordem.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('2000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeBox', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class CriarOrdemComponent implements OnInit {

  @ViewChildren('descricaoInput') descricaoInputs!: QueryList<ElementRef>;
  @ViewChild('pagamentoSelect') pagamentoSelect!: ElementRef;

  motoCount: number = 0;
  motos: any[] = []; // Array para armazenar as motos
  nInvoice: number = null;
  nomeCliente: string = '';
  vat: number = null;
  status: string = '';
  observacao: string = '';
  pagamentoTipo: string;
  quantidadeParcelas: number | null = null;
  valorTotalGeral: number = 0;
  valorTotalGeralComVat: number = 0;
  valorEntrada: number = null;
  vatAnterior: number = 0;

  modalNomeCliente: string = '';

  isModalClientOpen = false;

  clienteId: string = null;

  periodoPagamento: string;

  findSugestao: boolean = false;

  parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opções de parcelamento de 1 a 10

  dataAtualBR: string = '';

  showSuccessAlert: boolean = false;
  messageAlert: string = '';
  showDangerAlert: boolean = false;

  sugestoes: any[] = [];

  constructor(private ordemServicoService: OrdemservicoService,
              private clienteService : ClientesService,
              private el: ElementRef
  ) { }

  ngOnInit() {
    const hoje = new Date();
    this.dataAtualBR = hoje.toLocaleDateString('en-GB', { timeZone: 'Europe/London' });

    // Inicialize o pagamentoTipo
    this.pagamentoTipo = 'Pagamento à Vista';

    this.periodoPagamento = 'SEMANAL';

    // Defina o valor do select programaticamente
    if (this.pagamentoSelect) {
        this.pagamentoSelect.nativeElement.value = this.pagamentoTipo;
    }


    console.log(this.periodoPagamento);

    this.atualizarValorTotalGeral();
    this.incluirMoto();
    this.incluirRegistro(0);
  }

  criarOrdemServico() : OrdemServico {
    console.log(this.pagamentoTipo);

    const ordemServico: OrdemServico = {
      id: 0,
      invoiceNumber: this.nInvoice,
      vat: this.vat || 0,
      dataInicio: null, //this.dataAtualBR,
      valorTotal: this.valorTotalGeral,
      tipoPagamento: this.periodoPagamento,
      observacao: this.observacao,
      quantidadeParcelas: this.quantidadeParcelas || 0, // Garantir que sempre tenha um valor
      detalheServico: this.motos.flatMap(moto => {
        return moto.registros.map(registro => ({
          placa: moto.placa, // Placa da moto
          descricao: registro.descricao || null, // Descrição do registro (pode ser null)
          quantidade: registro.qtd || 1, // Quantidade (zero caso não esteja preenchido)
          milhagem: parseFloat((registro.milhagem ?? 0).toString().replace(/[^\d]/g, "")) || 0,
          observacao: moto.observacao,
          nomeMotorista: moto.nomeMotorista,
          data: null, // Usando a data atual
          valor: parseFloat(registro.preco.replace(/[^\d]/g, "")) / 100 || 0 // Preço do registro em formato monetário (dividido por 100)
        }));
      }),
      pagamento: [
        {
          id: null, // Id do pagamento (deve ser ajustado conforme sua lógica)
          valorPago: this.pagamentoTipo == "Pagamento Parcelado" ? this.valorEntrada : this.valorTotalGeral,
          dataPagamento: null //new Date().toISOString()
        }
      ],
      statusOrdemServico: {},
      parcela: [] // Crie as parcelas conforme a quantidade
      ,
      cliente: undefined
    };
    console.log(ordemServico);

    return ordemServico;
  }

  onNomeClienteChange() {
    if (this.nomeCliente.length > 1) { // Evita chamadas para menos de 3 caracteres
      this.clienteService.getClienteByNameContains(this.nomeCliente).subscribe(clientes => {
        this.sugestoes = clientes;
      });
    } else {
      this.findSugestao = false;
      this.sugestoes = [];
    }
  }
  selecionarSugestao(sugestao: any) {
    // Preenche o campo com o nome selecionado
    this.nomeCliente = sugestao.nome;
    this.clienteId = sugestao.id;
    // Limpa as sugestões após a seleção
    this.findSugestao = true;
    this.sugestoes = [];
  }

  createClient() {
    this.modalNomeCliente = this.nomeCliente;
    console.log(this.modalNomeCliente);
    this.isModalClientOpen = true;
    this.findSugestao = true;
    document.getElementById('modal-overlay')?.classList.add('show');
  }

  onClienteCriado(nome: string, response: boolean) {
    this.nomeCliente = nome;         // Atualiza input
    if (response == true){
      this.findSugestao = true;
      this.messageAlert = 'Cliente cadastrado com sucesso!';
      this.showSuccessAlert = true;
      this.autoCloseAlert();
    }else{
      this.findSugestao = false;
    }
    this.closeModalClient();         // Fecha modal e overlay
  }


  closeModalClient() {
    this.isModalClientOpen = false;
    document.getElementById('modal-overlay')?.classList.remove('show');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Verifique se o clique foi fora do input ou da lista de sugestões
    if (!target.closest('.sugestoes') && !target.closest('.input-nome-cliente')) {
      this.sugestoes = []; // Limpa as sugestões
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.onSubmit(form); // Chama o método onSubmit() para processar os dados
    } else {
      console.log('Formulário inválido');
      this.showDangerAlert = true;
      this.autoCloseAlert();
    }
  }

  async getClientByname(name: string): Promise<void> {
    console.log('getClientByname', name);

    const clientes = await firstValueFrom(this.clienteService.getClienteByNameContains(name));

    let id: number = 0;

    clientes.forEach(cliente => {
      console.log("BEFORE " + cliente.nome);
      if (cliente.nome === name) {
        console.log("ACHOU " + cliente.nome);
        id = cliente.id;
      }
    });

    console.log("ID " + id);
    this.clienteId = id.toString();
    console.log('cliente', this.clienteId);
    console.log("ID CLIENTE : " + this.clienteId);
  }

  async createOrdemServico(): Promise<void>{
    this.ordemServicoService.postOrdemServico(this.criarOrdemServico(),this.clienteId).subscribe(
      response => {
        console.log('Ordem de serviço cadastrada com sucesso!', response);
        // Zera tudo antes de recalcular
        this.motos = [];
        this.valorEntrada = null;
        this.vat = null;

        this.valorTotalGeral = 0;
        this.valorTotalGeralComVat = 0;
        this.observacao = '';
        this.nomeCliente = '';

        this.messageAlert = 'A ordem de serviço foi criada com sucesso!'
        this.showSuccessAlert = true;
        this.autoCloseAlert();

        // Adiciona moto e registro DEPOIS de tudo estar limpo
        this.incluirMoto();
        this.incluirRegistro(0); // importante: isso recalcula o total
      },
      error => {
        console.error('Erro ao cadastrar a ordem de serviço', error);
        this.showDangerAlert = true;
        this.autoCloseAlert();
      }
    );
  }


  async onSubmit(form: NgForm) {
    // Enviar os dados para o backend
    console.log('Enviando dados para o backend:'); // Verifique os dados
    await this.getClientByname(this.nomeCliente);
    console.log("ID CLIENTE principal: "+ this.clienteId);
    await this.createOrdemServico();
  }

  onVatChange() {
    this.atualizarValorTotalGeral();
  }


  atualizarValorTotalGeral() {
    this.valorTotalGeral = this.motos.reduce((total, moto) => total + this.calcularSoma(moto), 0);
    console.log("APOS RESET"+this.valorTotalGeral);
    if(this.vat > 0){
      const vatPercentual = this.vat || 0;
      const valorComVat = this.valorTotalGeral + (this.valorTotalGeral * vatPercentual / 100);
      this.valorTotalGeral = parseFloat(valorComVat.toFixed(2));
    }

    console.log(this.valorTotalGeral);
    this.atualizarValorFinal();
  }

  atualizarValorFinal(): number {
    return this.valorTotalGeral - (this.valorEntrada || 0);
  }

  onValorEntradaChange() {
    this.atualizarValorTotalGeral(); // Recalcula o total ao editar o preço
  }

  onQuantidadeParcelasChange() {
    // Calcular o valor de cada parcela ao mudar a quantidade de parcelas
    if (this.quantidadeParcelas) {
      const valorParcela = (this.valorTotalGeral - this.valorEntrada) / this.quantidadeParcelas;
      console.log(`Valor de cada parcela: £${valorParcela}`);
    }
  }

  onPrecoInput(event: Event, i: number, j: number): void {
    const input = event.target as HTMLInputElement;
    const caretPos = input.selectionStart || 0;
    const originalLen = input.value.length;

    this.motos[i].registros[j].preco = this.formatCurrency(input.value);

    setTimeout(() => {
      const updatedLen = this.motos[i].registros[j].preco.length;
      const newCaretPos = updatedLen - originalLen + caretPos;
      input.setSelectionRange(newCaretPos, newCaretPos);
    });
  }

  onPrecoBlur(i: number, j: number): void {
    this.motos[i].registros[j].preco = this.formatCurrency(this.motos[i].registros[j].preco, true);
    console.log(this.formatCurrency(this.motos[i].registros[j].preco, true));
  }

  formatNumber(value: string): string {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatCurrency(value: string, blur: boolean = false): string {
    if (!value) return "";

    if (value.indexOf(".") >= 0) {
      const decimalPos = value.indexOf(".");
      let left = value.substring(0, decimalPos);
      let right = value.substring(decimalPos);

      left = this.formatNumber(left);
      right = this.formatNumber(right);
      if (blur) right += "00";
      right = right.substring(0, 2);

      return "£" + left + "." + right;
    } else {
      value = this.formatNumber(value);
      value = "£" + value;
      if (blur) value += ".00";
      return value;
    }
  }


  incluirMoto() {

    this.motos.forEach(moto => {
      moto.isCollapsed = true; // Define todos os blocos como fechados
    });
    this.motoCount++;
    const moto = {
      id: this.motoCount,
      placa: '',
      qtd: null,
      descricao: '',
      preco: null,
      milhagem: 0,
      observacao: '',
      nomeMotorista: '',
      data: '',
      registros: [], // Inicializa um array para os registros
      isCollapsed: false // Inicializa como colapsado
    };
    this.motos.push(moto); // Adiciona a nova moto ao array
  }

  incluirRegistro(motoIndex: number) {
    // Adiciona um registro vazio à moto correspondente
    this.motos[motoIndex].registros.push({
      qtd: 1,
      descricao: '',
      preco: null,
      data: '',
      milhagem: 0,
      nomeMotorista: '',
      observacao: '',
    });
    this.atualizarValorTotalGeral();
  }

  calcularSoma(moto: any): number {
    // Inicializa a soma como zero
    let soma = 0;

    // Verifica e processa o preço da moto
    if (moto.preco) {
        const precoMoto = parseFloat(moto.preco.replace(/[^\d.]/g, "")); // Mantém como inteiro (em centavos)
        if (!isNaN(precoMoto)) {
            soma += precoMoto; // Adiciona se for um número válido
        }
    }

    // Verifica e processa os registros
    moto.registros.forEach((registro: any) => {
        if (registro.preco) {
          const precoRegistro = parseFloat(registro.preco.replace(/[^\d.]/g, "")); // Preserva o valor decimal
          if (!isNaN(precoRegistro)) {
                soma += precoRegistro; // Adiciona se for um número válido
            }
        }
    });
    return soma; // Retorna a soma total em formato de unidade
}


  removerRegistro(motoIndex: number, registroIndex: number) {
    this.motos[motoIndex].registros.splice(registroIndex, 1); // Remove o registro pelo índice
    this.atualizarValorTotalGeral();
  }

  removerMoto(motoIndex: number) {
    const totalMoto = this.calcularSoma(this.motos[motoIndex]);
    this.valorTotalGeral -= totalMoto; // Subtrai o total da moto do valor total geral

    this.motos.splice(motoIndex, 1); // Remove a moto pelo índice
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

  onPrecoChange() {
    this.atualizarValorTotalGeral(); // Recalcula o total ao editar o preço
  }

  onPeriodoPagamentoChange(value: string) {
    this.periodoPagamento = value;
    console.log('Periodo de Pagamento selecionado:', this.periodoPagamento);
  }

  onPagamentoChange(valor: string) {
    this.pagamentoTipo = valor;
    this.periodoPagamento = 'SEMANAL';
    console.log(this.periodoPagamento);

    // Lógica adicional se necessário
    if (valor === 'Pagamento Parcelado') {
        // Mostre a quantidade de parcelas, etc.
    } else {
        // Oculte a quantidade de parcelas
    }
    this.quantidadeParcelas = null; // Limpa a quantidade de parcelas se mudar para "À Vista"
  }

  // Função para fechar o alerta automaticamente após 5 segundos
  autoCloseAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false; // Fecha o alerta de sucesso
      this.showDangerAlert = false; // Fecha o alerta de erro
    }, 5000); // 5000 milissegundos = 5 segundos
  }

  onMilhasInput(event: Event, i: number, j: number): void {
    const input = event.target as HTMLInputElement;
    const caretPos = input.selectionStart || 0;
    const originalLen = input.value.length;

    this.motos[i].registros[j].milhagem = this.formatMilhas(input.value);

    setTimeout(() => {
      const updatedLen = this.motos[i].registros[j].milhagem.length;
      const newCaretPos = updatedLen - originalLen + caretPos;
      input.setSelectionRange(newCaretPos, newCaretPos);
    });
  }

  onMilhasBlur(i: number, j: number): void {
    this.motos[i].registros[j].milhagem = this.formatMilhas(this.motos[i].registros[j].milhagem, true);
    console.log(this.formatMilhas(this.motos[i].registros[j].milhagem, true));
  }

  formatMilhasNumber(value: string): string {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatMilhas(value: string, blur: boolean = false): string {
    if (!value) return "";

    if (value.indexOf(".") >= 0) {
      const decimalPos = value.indexOf(".");
      let left = value.substring(0, decimalPos);
      //let right = value.substring(decimalPos);

      left = this.formatMilhasNumber(left);
      //right = this.formatMilhasNumber(right);
      //if (blur) right += "00";
      //right = right.substring(0, 2);

      return left + ".";
    } else {
      value = this.formatMilhasNumber(value);
      if (blur) value += "";
      return value;
    }
  }
}
