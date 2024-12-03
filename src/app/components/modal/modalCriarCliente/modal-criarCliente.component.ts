import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ClientesService } from '../../../service/clientes/clientes.service';
import { Cliente } from '../../../service/models/cliente.model';
import { NgForm } from '@angular/forms';

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
export class ModalCriarClienteComponent {

  @Output() close = new EventEmitter<void>();

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  newCliente: Cliente = {
    id: 0,  // Este ID será gerado automaticamente pelo backend
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    email: '',
    numeroDrive: 0,
    numeroPassaporte: 0,
    numeroRg: 0,
    telefone: [
      { id_telefone: 0, tipo: 'CELULAR', country: 'BR', ddd: 44, numero: null }
    ],
    endereco: [
      { id_endereco: 0, rua: '', numero: null, postcode: '', cidade: '' }
    ],
  };

  constructor(private clientesService: ClientesService) { }

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
    //document.getElementById('modal-overlay')?.classList.remove('show');
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      this.onSubmit(form); // Chama o método onSubmit() para processar os dados
    } else {
      console.log('Formulário inválido');
    }
  }

  onSubmit(form: NgForm) {
    // Enviar os dados para o backend
    console.log('Enviando dados para o backend:', this.newCliente); // Verifique os dados

    this.clientesService.criarCliente(this.newCliente).subscribe(
      (response) => {
        console.log('Cliente criado com sucesso!', response);
        this.showSuccessAlert = true;
        this.autoCloseAlert();
        form.reset();
      },
      (error) => {
        console.error('Erro ao criar cliente:', error);
        this.showDangerAlert = true;
        this.autoCloseAlert();
      }
    );
  }

  // Função para fechar o alerta automaticamente após 5 segundos
  autoCloseAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false; // Fecha o alerta de sucesso
      this.showDangerAlert = false; // Fecha o alerta de erro
    }, 5000); // 5000 milissegundos = 5 segundos
  }

}
