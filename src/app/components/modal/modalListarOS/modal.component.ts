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

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); // Emite o evento para o componente pai
  }

  onBackgroundClick(event: MouseEvent) {
    this.closeModal();
  }
}
