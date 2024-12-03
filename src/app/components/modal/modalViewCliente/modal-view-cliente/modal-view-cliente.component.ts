import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

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

  endereco: string = null;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  constructor() { }

  ngOnInit(): void {
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

}
