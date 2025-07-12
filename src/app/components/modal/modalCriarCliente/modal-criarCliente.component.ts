import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ClientesService } from '../../../service/clientes/clientes.service';
import { Cliente } from '../../../models/cliente.model';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/service/shared/shared.service';

@Component({
  selector: 'modal-criar-cliente',
  templateUrl: './modal-criarCliente.component.html',
  styleUrls: ['./modal-criarCliente.component.scss'],
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
export class ModalCriarClienteComponent implements OnInit, OnChanges{
  @Input() nomeInicial: string = '';
  @Output() clienteCriado = new EventEmitter<{ nome: string; clienteNovo: boolean }>();
  @Output() close = new EventEmitter<void>();

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  messageAlert: string = ''

  dataClienteNascimento: string = '';

  constructor(private clientesService: ClientesService, private sharedService: SharedService) { }

  newCliente: Cliente = {
    id: 0,  // Este ID será gerado automaticamente pelo backend
    nome: this.nomeInicial,
    sobrenome: '',
    dataNascimento: '',
    email: '',
    numeroDrive: 0,
    numeroPassaporte: 0,
    numeroRg: 0,
    telefone: [
      { id_telefone: 0, tipo: 'CELULAR', country: 'BR', ddd: null, numero: null }
    ],
    endereco: [
      { id_endereco: 0, rua: '', numero: null, postcode: '', cidade: '' }
    ],
  };

  ngOnInit() {
    this.newCliente.nome = this.nomeInicial;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nomeInicial']) {
      this.newCliente.nome = this.nomeInicial;
    }
  }

  closeModalAfeterCreate() {
    this.close.emit();
  }

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
    this.clienteCriado.emit({
      nome: this.newCliente.nome,
      clienteNovo: false
    });
  }

  onBackgroundClick(event: MouseEvent) {
    this.clienteCriado.emit({
      nome: this.newCliente.nome,
      clienteNovo: false
    });
    this.closeModal();
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.onSubmit(form); // Chama o método onSubmit() para processar os dados
    } else {
      this.messageAlert = " Preencha todos os campos obrigatórios!"
      this.showDangerAlert = true;
    }
  }

  getDefaultClient(){
    this.dataClienteNascimento = '';
     return {
      id: 0,  // Este ID será gerado automaticamente pelo backend
      nome: '',
      sobrenome: '',
      dataNascimento: '',
      email: '',
      numeroDrive: 0,
      numeroPassaporte: 0,
      numeroRg: 0,
      telefone: [
        { id_telefone: 0, tipo: 'CELULAR', country: 'BR', ddd: null, numero: null }
      ],
      endereco: [
        { id_endereco: 0, rua: '', numero: null, postcode: '', cidade: '' }
      ],
    };
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


  criarCliente(): Cliente{

    // Usando filter para criar um novo array com os itens válidos
    this.newCliente.telefone = this.newCliente.telefone.filter(telefone => telefone.numero != null && telefone.numero != 0 && telefone.ddd != 0);

    this.newCliente.telefone[0].country = this.verificarPais(String(this.newCliente.telefone[0].ddd));

    return this.newCliente;
  }

  onSubmit(form: NgForm) {
    // Enviar os dados para o backend
    console.log('Enviando dados para o backend:', this.criarCliente()); // Verifique os dados
    this.clienteCriado.emit({
      nome: this.newCliente.nome,
      clienteNovo: true
    });
    this.clientesService.criarCliente(this.criarCliente()).subscribe(
      (response) => {
        console.log('Cliente criado com sucesso!', response);
        this.messageAlert = " Cliente cadastrado com sucesso!"
        this.showSuccessAlert = true;
        this.sharedService.notifyClientCreated();
        this.autoCloseAlert();
        this.newCliente = this.getDefaultClient();
      },
      (error) => {
        this.messageAlert = " Não foi possivel cadastrar o cliente!"
        this.showDangerAlert = true;
        console.error('Erro ao criar cliente:', error);
        this.autoCloseAlert();
      }
    );
  }

  formatarData() {
    // Remove todos os caracteres não numéricos
    let data = this.dataClienteNascimento.replace(/\D/g, '');

    // Formata para dd/MM/yy
    if (data.length > 2) {
      data = data.substring(0, 2) + '/' + data.substring(2);
    }
    if (data.length > 5) {
      data = data.substring(0, 5) + '/' + data.substring(5, 7);
    }

    // Atualiza o valor no input (formato dd/MM/yy)
    this.dataClienteNascimento = data;

    // Se a data estiver completa (8 caracteres, incluindo as barras)
    if (data.length === 8) {
      const dia = data.substring(0, 2);
      const mes = data.substring(3, 5);
      const anoCurto = data.substring(6, 8);

      // Converte ano curto para ano completo (yyyy)
      // Aqui, você pode definir a regra para o século.
      // Exemplo: se ano < 50, considera 2000+ano, senão 1900+ano
      let anoCompleto = parseInt(anoCurto, 10);
      anoCompleto += (anoCompleto < 30) ? 2000 : 1900;
      const datamontada = `${dia}/${mes}/${anoCompleto}`
      console.log("DATA MONTADA:"+ datamontada );
      // Monta a data com ano completo
      this.newCliente.dataNascimento = `${dia}/${mes}/${anoCompleto}`;
    }
  }

  // Função para fechar o alerta automaticamente após 5 segundos
  autoCloseAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false; // Fecha o alerta de sucesso
      this.showDangerAlert = false; // Fecha o alerta de erro
    }, 5000); // 5000 milissegundos = 5 segundos
  }

}
