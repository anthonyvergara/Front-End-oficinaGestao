import { Component, OnInit, QueryList, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { NgForm } from '@angular/forms';

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
  dataPrimeiraParcela: string | null = null;
  valorTotalGeral: number = 0;
  valorEntrada: number = null;
  ultimoPagamento: string = '';

  periodoPagamento: string;

  parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opções de parcelamento de 1 a 10

  dataAtualBR: string = '';

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;
  
  constructor(private ordemServicoService: OrdemservicoService) { }

  ngOnInit() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = hoje.getFullYear();
    // Inicialize o pagamentoTipo
    this.pagamentoTipo = 'Pagamento à Vista';

    this.periodoPagamento = 'SEMANAL';

    // Defina o valor do select programaticamente
    if (this.pagamentoSelect) {
        this.pagamentoSelect.nativeElement.value = this.pagamentoTipo;
    }

    this.dataAtualBR = `${dia}/${mes}/${ano}`;

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
          id: moto.id, // Usando o ID da moto
          placa: moto.placa, // Placa da moto
          descricao: registro.descricao || null, // Descrição do registro (pode ser null)
          quantidade: registro.qtd || 1, // Quantidade (zero caso não esteja preenchido)
          milhagem: registro.milhagem || null, // Milhagem do registro
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

  submitForm(form: NgForm) {
    if (form.valid) {
      this.onSubmit(form); // Chama o método onSubmit() para processar os dados
    } else {
      console.log('Formulário inválido');
      this.showDangerAlert = true;
      this.autoCloseAlert();
    }
  }

  onSubmit(form: NgForm) {
    // Enviar os dados para o backend
    console.log('Enviando dados para o backend:'); // Verifique os dados

    this.ordemServicoService.postOrdemServico(this.criarOrdemServico()).subscribe(
      response => {
        console.log('Ordem de serviço cadastrada com sucesso!', response);
        this.showSuccessAlert = true;
        this.autoCloseAlert();
        form.reset();
      },
      error => {
        console.error('Erro ao cadastrar a ordem de serviço', error);
        this.showDangerAlert = true;
        this.autoCloseAlert();
      }
    );
  }

  atualizarValorTotalGeral() {
    this.valorTotalGeral = this.motos.reduce((total, moto) => total + this.calcularSoma(moto), 0);
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
      milhagem: '',
      data: '',
      registros: [], // Inicializa um array para os registros
      isCollapsed: false // Inicializa como colapsado
    };
    this.motos.push(moto); // Adiciona a nova moto ao array
  }

  incluirRegistro(motoIndex: number) {
    // Adiciona um registro vazio à moto correspondente
    this.motos[motoIndex].registros.push({
      qtd: null,
      descricao: '',
      preco: null,
      data: '',
      milhagem: null
    });
    this.atualizarValorTotalGeral();
  }

  calcularSoma(moto: any): number {
    // Inicializa a soma como zero
    let soma = 0;

    // Verifica e processa o preço da moto
    if (moto.preco) {
        const precoMoto = parseInt(moto.preco.replace(/[^\d]/g, ""), 10); // Mantém como inteiro (em centavos)
        if (!isNaN(precoMoto)) {
            soma += precoMoto; // Adiciona se for um número válido
        }
    }

    // Verifica e processa os registros
    moto.registros.forEach((registro: any) => {
        if (registro.preco) {
            const precoRegistro = parseInt(registro.preco.replace(/[^\d]/g, ""), 10); // Mantém como inteiro (em centavos)
            if (!isNaN(precoRegistro)) {
                soma += precoRegistro; // Adiciona se for um número válido
            }
        }
    });
    return soma / 100; // Retorna a soma total em formato de unidade
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
}
