import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  constructor() { }

  modalData: any;
  isModalOpen = false;

  orders = [
    { status: 'ATRASADO', clientName: 'ANTHONY DE OLIVEIRA VERGARA', totalValue: '£200.00', creationDate: '14/09/2024', completion: '20%' },
    { status: 'AGENDADO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£150.00', creationDate: '31/10/2024', completion: '50%' },
    { status: 'ATRASADO', clientName: 'MICHAEL DE OLIVEIRA VERGARA', totalValue: '£200.00', creationDate: '14/09/2024', completion: '65%' },
    { status: 'AGENDADO', clientName: 'BRYAN BASTOS VERGARA', totalValue: '£150.00', creationDate: '31/10/2024', completion: '70%' },
    { status: 'PAGO', clientName: 'RICHARD DE OLIVEIRA VERGARA', totalValue: '£150.00', creationDate: '31/10/2024', completion: '100%' },
    // Adicione mais ordens conforme necessário
  ];

  ngOnInit() {
  }

  openModal(status: string, clientName: string, totalValue: string, creationDate: string) {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });
    this.isModalOpen = true;

    this.modalData = {
      status,
      clientName,
      totalValue,
      creationDate
    };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Impede a propagação do evento de clique
    // Adicione a lógica que você deseja executar ao clicar no botão
  }
}
