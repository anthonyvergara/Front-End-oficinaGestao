import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChildren('descricaoInput') descricaoInputs!: QueryList<ElementRef>;

  motoCount: number = 0;
  motos: any[] = []; // Array para armazenar as motos
  nInvoice: string = '';
  nomeCliente: string = '';
  vat: string = '';
  status: string = '';
  observacao: string = '';
  pagamentoTipo: string = 'Pagamento à Vista';
  quantidadeParcelas: number | null = null;
  dataPrimeiraParcela: string | null = null;
  valorTotal: string = '';
  valorEntrada: string = '';
  valorFinal: string = '';
  ultimoPagamento: string = '';

  constructor() { }

  ngOnInit() {
    // Qualquer lógica de inicialização necessária
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
      data: ''
    });
  }

  calcularSoma(moto: any): number {
    // Soma o preço da moto, convertendo para número
    let soma = parseFloat(moto.preco) || 0; // Converte para número ou 0
  
    // Soma os preços dos registros, convertendo para número
    moto.registros.forEach((registro: any) => {
      soma += parseFloat(registro.preco) || 0; // Converte para número ou 0
    });
  
    return soma;
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
        const nextRegistroIndex = registroIndex + 1;
        if (nextRegistroIndex < this.descricaoInputs.length) {
          this.descricaoInputs.toArray()[nextRegistroIndex].nativeElement.focus();
        }
      });

    }
  }

  onPagamentoChange(event: any) {
    this.quantidadeParcelas = null; // Limpa a quantidade de parcelas se mudar para "À Vista"
  }

}
