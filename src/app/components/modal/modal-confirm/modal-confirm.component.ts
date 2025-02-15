import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
        ])
      ]),
      trigger('fadeBox', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
        ])
      ])
    ],
})
export class ModalConfirmComponent implements OnInit {

  @Output() close = new EventEmitter<void>();  // Evento de fechamento do modal
  @Output() fecharModalPagar = new EventEmitter<void>();
  @Output() pagar = new EventEmitter<void>();
  @Input() modalControl: boolean | undefined;
  @Input() message: string | undefined;

  constructor() {}

  ngOnInit(): void {}

  efetuarPagamento(){
    this.modalControl = false;
    this.fecharModalPagar.emit();
    this.pagar.emit()
  }

  closedModal() {
    this.modalControl = false;
    this.close.emit(); // Emitir evento de fechamento
  }

}
