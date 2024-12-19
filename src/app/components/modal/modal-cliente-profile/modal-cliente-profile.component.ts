import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-cliente-profile',
  templateUrl: './modal-cliente-profile.component.html',
  styleUrls: ['./modal-cliente-profile.component.scss']
})
export class ModalClienteProfileComponent implements OnInit {

  constructor() { }

  @Input() isModalOpen: boolean = false;  // Recebe a visibilidade
  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal

  ngOnInit(): void {
  }

  onBackgroundClick(event: MouseEvent) {
    this.closedModal();
  }

  closedModal() {
    this.isModalOpen = false;  // Fecha o modal
    this.close.emit();  // Emite evento para o componente pai
  }

}
