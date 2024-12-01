import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('2000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class IconsComponent implements OnInit {

  isModalOpen = false;

  constructor() { }

  orders = [
    { status: 'ATRASADO', clientName: 'ANTHONY DE OLIVEIRA VERGARA', totalValue: '£200.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'AGENDADO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£150.00', creationDate: 'anthonyvergara@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'MICHAEL DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'michael@gmail.com', completion: '07858312007' },
    { status: 'AGENDADO', clientName: 'BRYAN BASTOS VERGARA', totalValue: '£150.00', creationDate: 'emailbonitoegrande@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    { status: 'PAGO', clientName: 'JENNIFER DE OLIVEIRA VERGARA', totalValue: '£0.00', creationDate: 'teste@gmail.com', completion: '07858312007' },
    // Adicione mais ordens conforme necessário
  ];

  ngOnInit() {
  }

  openModal() {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });
    this.isModalOpen = true;

    document.getElementById('modal-overlay')?.classList.add('show');
  }

  closeModal() {
    this.isModalOpen = false;
    document.getElementById('modal-overlay')?.classList.remove('show');
  }

  handleButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Impede a propagação do evento de clique
    // Adicione a lógica que você deseja executar ao clicar no botão
  }

  recordsToShow = 5;  // Número de registros a serem exibidos
  searchQuery = '';   // Para buscar pelo nome do cliente

  get filteredOrders() {
    return this.orders.filter(order =>
      order.clientName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  setRecords(records: number) {
    this.recordsToShow = records;
  }

  sortDirection: { [key: string]: 'asc' | 'desc' } = {};  // Para controlar a direção da ordenação
  sortColumn: string = '';  // Para armazenar a coluna que está sendo ordenada

  // Função para alternar a direção da ordenação e ordenar os dados
  sortTable(column: string) {
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.sortColumn = column;

    this.orders = this.orders.sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
