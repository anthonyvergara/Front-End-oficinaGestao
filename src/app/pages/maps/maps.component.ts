import { Component, OnInit, QueryList, ViewChildren, ElementRef, ViewChild } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChildren('descricaoInput') descricaoInputs!: QueryList<ElementRef>;
  @ViewChild('pagamentoSelect') pagamentoSelect!: ElementRef;

  motoCount: number = 0;
  motos: any[] = []; // Array para armazenar as motos
  nInvoice: string = '';
  nomeCliente: string = '';
  vat: string = '';
  status: string = '';
  observacao: string = '';
  pagamentoTipo: string;
  quantidadeParcelas: number | null = null;
  dataPrimeiraParcela: string | null = null;
  valorTotal: string = '';
  valorEntrada: string = '';
  valorFinal: string = '';
  ultimoPagamento: string = '';

  dataAtualBR: string = '';

  constructor() { }

  ngOnInit() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = hoje.getFullYear();
    // Inicialize o pagamentoTipo
    this.pagamentoTipo = 'Pagamento à Vista';

    // Defina o valor do select programaticamente
    if (this.pagamentoSelect) {
        this.pagamentoSelect.nativeElement.value = this.pagamentoTipo;
    }
    this.dataAtualBR = `${dia}/${mes}/${ano}`;
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
  }

  removerMoto(motoIndex: number) {
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

  onPagamentoChange(valor: string) {
    this.pagamentoTipo = valor;

    // Lógica adicional se necessário
    if (valor === 'Pagamento Parcelado') {
        // Mostre a quantidade de parcelas, etc.
    } else {
        // Oculte a quantidade de parcelas
    }
    this.quantidadeParcelas = null; // Limpa a quantidade de parcelas se mudar para "À Vista"
  }

}
