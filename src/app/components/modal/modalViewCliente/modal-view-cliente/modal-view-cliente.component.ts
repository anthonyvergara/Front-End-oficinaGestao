import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { Parcela } from 'src/app/service/models/parcela.model';

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
export class ModalViewClienteComponent implements OnInit, OnChanges {

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

  endereco: string = null;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  constructor(private ordemServico : OrdemservicoService) { }

  ngOnInit(): void {
    this.findOrdemServicoCliente(this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se os valores de rua ou numero mudaram e faz a concatenação
    if (changes['nome']) {
      this.nome = this.capitalizeName(this.nome);
    }
    console.log("id cliente: "+this.id);
    
    if (changes['rua'] || changes['numero']) {
      this.atualizarEndereco();
    }
  }

  objectKeys(obj : any) : number[] {
    return Object.keys(obj).map(key => parseInt(key));
  }

  findOrdemServicoCliente(idCliente : string): void{

    this.ordemServico.getOrdemServicoByIdCliente(idCliente).subscribe(
      (ordem) => {
        this.listOrdemServico = ordem;

        this.listOrdemServico.forEach(ordens => {
          if(ordens.parcela.length > 0 && ordens.parcela.length != null){

            let parcelas : Parcela[] = [];

            ordens.parcela.forEach(parcela => {
              if(parcela.statusParcela != 'ATRASADO'){
                parcelas.push(parcela);
              }
            })

            this.listParcelasEmAtrasoEPagas[ordens.invoiceNumber] = parcelas;
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

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
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
