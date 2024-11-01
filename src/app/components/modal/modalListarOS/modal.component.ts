import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() status: string | undefined;
  @Input() clientName: string | undefined;
  @Input() totalValue: string | undefined;
  @Input() creationDate: string | undefined;

  @Output() close = new EventEmitter<void>(); // Emitir evento de fechamento

  closeModal() {
    this.close.emit(); // Emitir evento para o componente pai
  }
}
