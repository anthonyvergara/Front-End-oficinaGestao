import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PagamentoService} from '../../../service/pagamento/pagamento.service';
import {Pagamento} from '../../../models/pagamento.model';

@Component({
  selector: 'app-modal-history-payment',
  templateUrl: './modal-history-payment.component.html',
  styleUrls: ['./modal-history-payment.component.scss']
})
export class ModalHistoryPaymentComponent implements OnInit {
  @Input() modalPaymentHistory: boolean = false;  // Recebe a visibilidade
  @Input() ordemServico_id: number | undefined;
  @Output() close = new EventEmitter<void>();

  listPagamentos: Pagamento[] = [];

  constructor(private paymentService: PagamentoService) { }

  ngOnInit(): void {
    this.getPagamentosByIdOrdem();
  }

  closedModal() {
    this.modalPaymentHistory = false;  // Fecha o modal
    this.close.emit();  // Emite evento para o componente pai
  }

  getPagamentosByIdOrdem(): void {
    this.paymentService.getPaymentsByIdOrdem(this.ordemServico_id.toString()).subscribe({
      next: (response: Pagamento[]) => {
        this.listPagamentos = response
        .sort((a, b) => {
          // Converter "dd/MM/yyyy HH:mm:ss" para Date
          const dateA = this.parseDataHora(a.dataPagamento);
          const dateB = this.parseDataHora(b.dataPagamento);
          return dateB.getTime() - dateA.getTime(); // ordem decrescente
        });
      },
      error: (error) => {
        console.error('Erro ao buscar os pagamentos:', error);
      }
    });
  }

  private parseDataHora(dataHoraStr: string): Date {
    const [data, hora] = dataHoraStr.split(' '); // "09/07/2025 01:22:13"
    const [dia, mes, ano] = data.split('/');
    return new Date(`${ano}-${mes}-${dia}T${hora}`);
  }


}
