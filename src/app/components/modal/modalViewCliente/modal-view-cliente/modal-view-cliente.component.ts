import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
export class ModalViewClienteComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  @Input() id: string | undefined;
  @Input() nome: string | undefined;
  @Input() email: string | undefined;
  @Input() dataNascimento: string | undefined;
  @Input() telefone: number | undefined;

  showSuccessAlert: boolean = false;
  showDangerAlert: boolean = false;

  dataUltimoPagamento: string = "14/09/1996";

  constructor() { }

  ngOnInit(): void {
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

}
