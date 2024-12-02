import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ClientesService } from '../../service/clientes/clientes.service';
import { Cliente } from '../../service/models/cliente.model';  // Importando a interface Cliente

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
  orders: Cliente[] = [];  // Usando a interface Cliente
  searchQuery = '';   // Para buscar pelo nome do cliente
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};  // Para controlar a direção da ordenação
  sortColumn: string = '';  // Para armazenar a coluna que está sendo ordenada

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.loadClientes();  // Carregar os dados da API
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

  loadClientes(): void {
    this.clientesService.getClientes().subscribe(
      (clientes) => {
        this.orders = clientes;
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  handleButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Impede a propagação do evento de clique
    // Adicione a lógica que você deseja executar ao clicar no botão
  }

  get filteredOrders() {
    return this.orders.filter(order =>
      order.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Função para alternar a direção da ordenação e ordenar os dados
  sortTable(column: string) {
    // Alterna a direção da ordenação (asc/desc)
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.sortColumn = column;
  
    // Ordenação personalizada
    this.orders = this.orders.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
  
      // Se a propriedade for 'telefone', pegamos o primeiro número do array
      if (column === 'telefone' && aValue && bValue) {
        aValue = aValue[0].numero;  // Acessa o primeiro telefone
        bValue = bValue[0].numero;
      }
  
      // Comparação de strings e números
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Convertendo os valores para minúsculas para ignorar maiúsculas/minúsculas
        return direction === 'asc' ? aValue.toLowerCase().localeCompare(bValue.toLowerCase()) : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      // Caso o valor seja de outro tipo ou a comparação não tenha sido feita, mantemos 0 (sem mudança de posição)
      return 0;
    });
  }
  
  
}
