import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { OrdemServico } from 'src/app/models/ordemServico.model';
import { Parcela } from 'src/app/models/parcela.model';
import { Pagamento } from 'src/app/models/pagamento.model';
import {Cliente} from '../../../../models/cliente.model';
import {ClientesService} from '../../../../service/clientes/clientes.service';
import {SharedService} from '../../../../service/shared/shared.service';

@Component({
  selector: 'modal-view-cliente',
  templateUrl: './modal-view-cliente.component.html',
  styleUrls: ['./modal-view-cliente.component.scss'],
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
export class ModalViewClienteComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  @Input() id: string | undefined;
  @Input() nome: string | undefined;
  @Input() email: string | undefined;
  @Input() dataNascimento: string | undefined;
  @Input() telefone: number | undefined;
  @Input() ddd: number | undefined;
  @Input() rua: string | undefined;
  @Input() numero: number | undefined;
  @Input() cidade: string | undefined;
  @Input() postcode: string | undefined;
  @Input() saldoDevedor: number | undefined;

  listOrdemServico : OrdemServico[] = [];

  listParcelasEmAtrasoEPagas : { [key : number] : Parcela[] } = {};

  listParcelasPagas : { [key : number] : Parcela[] } = {};
  listPagamentos : {[invoice : number] : Pagamento[] } = {};

  endereco: string = null;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  messageAlert: string = '';

  modarViewOs = false;
  modalData: any;

  listClientes: Cliente[];

  constructor(private ordemServico : OrdemservicoService, private clienteServices: ClientesService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.findOrdemServicoCliente(this.id);
    this.getClientes(this.id);
  }

  getClientes(cliente_id: any): void {
    this.clienteServices.getClientes().subscribe((response) => {
      this.listClientes = response;

      const clienteEncontrado = this.listClientes.find((cliente: any) => cliente.id === cliente_id);

      if (clienteEncontrado) {
        console.log("CLIENTE ENCONTRADO")
        this.nome = clienteEncontrado.nome;
        this.email = clienteEncontrado.email;
        this.dataNascimento = clienteEncontrado.dataNascimento;
        this.telefone = clienteEncontrado.telefone[0].numero;
        this.ddd = clienteEncontrado.telefone[0].ddd;
        this.rua = clienteEncontrado.endereco[0].rua;
        this.numero = clienteEncontrado.endereco[0].numero;
        this.postcode = clienteEncontrado.endereco[0].postcode;
        this.cidade = clienteEncontrado.endereco[0].cidade;
        console.log(clienteEncontrado);
      } else {
        console.log("Cliente não encontrado.");
      }
    });
  }


  //TIRAR MAIUSCULA E FORMATAR PARA SOMENTE INICIAIS MAIUSCULAS
  // ngOnChanges(changes: SimpleChanges): void {
  //   // Verifica se os valores de rua ou numero mudaram e faz a concatenação
  //   if (changes['nome']) {
  //     this.nome = this.capitalizeName(this.nome);
  //   }
  //   console.log("id cliente: "+this.id);

  //   if (changes['rua'] || changes['numero']) {
  //     this.atualizarEndereco();
  //   }
  // }

  objectKeys(obj : any) : number[] {
    return Object.keys(obj).map(key => parseInt(key));
  }

  getParcelasAtrasadas() : number{
    let keys : number[] = this.objectKeys(this.listParcelasEmAtrasoEPagas);

    let valorTotalAtrasado = 0;

    keys.forEach(key => {
      this.listParcelasEmAtrasoEPagas[key].forEach(value => {
        if(value.statusParcela == "ATRASADO"){
          valorTotalAtrasado += value.valorParcela;
        }
      })
    })

    return valorTotalAtrasado;
  }

  verificarPais(codigoPais: string): string {
    switch (codigoPais) {
      case '55':
        return 'BR';
      case '1':
        return 'USA / CAD';
      case '44':
        return 'UK';
      case '49':
        return 'GER';
      case '33':
        return 'FRA';
      case '34':
        return 'ESP';
      case '81':
        return 'JPN';
      case '86':
        return 'China';
      case '39':
        return 'ITA';
      default:
        return 'Outro país';
    }
  }

  updateClient() {
    const cliente: Cliente = {
      id: Number(this.id),
      nome: this.nome,
      sobrenome: '',
      dataNascimento: this.dataNascimento,
      email: this.email,
      numeroDrive: 0,
      numeroPassaporte: 0,
      numeroRg: 0,
      telefone: [
        { id_telefone: 0, tipo: 'CELULAR', country: 'BR', ddd: this.ddd, numero: this.numero },
      ],
      endereco: [
        { id_endereco: 0, rua: this.rua, numero: this.numero, postcode: this.postcode, cidade: this.cidade },
      ],
    };
    cliente.telefone[0].country = this.verificarPais(String(this.ddd));

    this.clienteServices.atualizarCliente(cliente).subscribe(
      (response) => {
        this.messageAlert = " Cliente atualizado com sucesso!"
        this.showSuccessAlert = true;
        this.sharedService.notifyClientCreated();
        this.autoCloseAlert();
      },
      (error) => {
        this.messageAlert = " Não foi possivel atualizar o cliente!"
        this.showDangerAlert = true;
        console.error('Erro ao atualizar cliente:', error);
        this.autoCloseAlert();
      }
    );

  }

  findOrdemServicoCliente(idCliente : string): void{

    this.ordemServico.getOrdemServicoByIdCliente(idCliente).subscribe(
      (ordem) => {
        this.listOrdemServico = ordem;
        this.getPagamentos();
        this.listOrdemServico.forEach(ordens => {
          if(ordens.parcela.length > 0 && ordens.parcela.length != null){

            let parcelas : Parcela[] = [];

            ordens.parcela.forEach(parcela => {
              if(parcela.statusParcela != 'PAGO'){
                parcelas.push(parcela);
              }
            })

            this.listParcelasEmAtrasoEPagas[ordens.invoiceNumber] = parcelas.sort((a,b) => a.dataVencimento.localeCompare(b.dataVencimento));
            this.parcelasPagas();

          }
        })

      },
      (error) => {
        console.error("Não foi possivel carregar as ordens de serviço do cliente!", error)
      }
    )
  }

  // Método para atualizar o endereço concatenado
  atualizarEndereco(): void {
    if (this.rua && this.numero) {
      this.endereco = `${this.rua}, ${this.numero}, ${this.postcode.toUpperCase()}, ${this.cidade}`;
    } else {
      this.endereco = ''; // Se não houver rua ou número, endereço ficará vazio
    }
  }

  getPagamentos() {
    this.listPagamentos = {}; // limpa antes de popular
    this.listOrdemServico.forEach(os => {
      const idOrdemServico = os.invoiceNumber; // ou os.idOrdemServico, conforme o seu modelo
      if (!this.listPagamentos[idOrdemServico]) {
        this.listPagamentos[idOrdemServico] = [];
      }

      if(os.quantidadeParcelas == 0){
        var pagamento : Pagamento = {
          id : 0,
          valorPago : os.valorTotal,
          dataPagamento : os.dataInicio.split(' ')[0]
        }
        this.listPagamentos[idOrdemServico].push(pagamento);
        return;
      }
      os.pagamento?.forEach(p => {
        p.dataPagamento = p.dataPagamento.split(' ')[0];
        this.listPagamentos[idOrdemServico].push(p);
      });
    });
  }

  openModal(id: number, status: string, valorTotal: number, nome: string) {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });


    document.getElementById('modal-overlay')?.classList.add('show');

    const ordemEncontrada = this.listOrdemServico.find(ordem => ordem.id == id);

    let valorEntrada = 0; // Inicializa com null ou qualquer valor padrão
    if (ordemEncontrada) {
      if(ordemEncontrada.pagamento != null){
        ordemEncontrada.pagamento.forEach(pagamento => {
          valorEntrada += pagamento.valorPago;
        })
      }
    }
    this.modalData = {
      id,
      nome,
      status,
      valorTotal,
      valorEntrada
    };

    this.modarViewOs = true;
  }


  parcelasPagas(){
    this.listParcelasPagas = {};

    this.listOrdemServico.forEach(os => {
      const pagos = os.parcela?.filter(p => p.statusParcela == 'PAGO') || [];
      this.listParcelasPagas[os.invoiceNumber] = pagos;
    })
  }

  closeModal() {
    this.modarViewOs = false; // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
  }

  closeMyModal(){
    this.close.emit();
    this.modarViewOs = false;
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeMyModal();
  }

  submitForm() {
  }

  onSubmit() {
    // Enviar os dados para o backend
  }

  // Função para fechar o alerta automaticamente após 5 segundos
  autoCloseAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false; // Fecha o alerta de sucesso
      this.showDangerAlert = false; // Fecha o alerta de erro
    }, 5000); // 5000 milissegundos = 5 segundos
  }

  capitalizeName(name: string): string {
    // Divide o nome em palavras, transforma cada palavra e junta novamente
    return name
      .split(' ')  // Divide a string em palavras
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitaliza a primeira letra e deixa o resto minúsculo
      )
      .join(' ');  // Junta as palavras de volta com um espaço entre elas
  }

  formatDate(dateString: string): string {
    // Supondo que a data seja fornecida no formato dd/MM/yyyy (exemplo: '09/12/2024')
    const [day, month, year] = dateString.split('/');

    // Garantindo que o ano tenha 2 dígitos
    const shortYear = year.slice(2);  // Pega os dois últimos dígitos do ano (exemplo: '2024' -> '24')

    // Retorna a data no formato 'dd/MM/yy'
    return `${day}/${month}/${shortYear}`;
  }

}
