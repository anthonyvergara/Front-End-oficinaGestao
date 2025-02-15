import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal
  @Input() modalControl: boolean | undefined;

  constructor() {}

  ngOnInit(): void {}

  closedModal() {
    this.modalControl = false;
    this.close.emit(); // Emitir evento de fechamento
  }

  openModalConfirm() {
    this.modalControl = true; // Reabre o modal
  }

}
