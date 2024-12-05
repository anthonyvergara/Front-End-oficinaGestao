import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { Cliente } from 'src/app/service/models/cliente.model';
import { ClientesService } from 'src/app/service/clientes/clientes.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
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
export class ListarComponent implements OnInit {

  constructor(private clienteService: ClientesService, private ordemServico: OrdemservicoService) { }

  modalData: any;
  isModalOpen = false;

  orders : OrdemServico[] = [];

  cliente: {[key: number] : string} = {};

  ngOnInit() {
    this.loadOrdemServico();
  }

  getNomeCliente(idOrdemServico: number){
    return this.cliente[idOrdemServico];
  }

  loadCliente(idOrdemServico: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clienteService.getClienteByIdOrdemServico(idOrdemServico).subscribe(
        (cliente) => {
          this.cliente[idOrdemServico] = cliente.nome;
          resolve();
        },
        (error) => {
          console.error("Erro ao resgatar cliente", error);
          this.cliente[idOrdemServico] = '';  // Garantir que a chave exista mesmo que o nome não seja encontrado
          reject(error);
        }
      );
    });
  }

  loadOrdemServico(): void {
    this.ordemServico.getAllOrdemServico().subscribe(
      (ordemServico) => {
        this.orders = ordemServico;
        // Usando Promise.all para aguardar todos os clientes serem carregados
        const clientesPromises = this.orders.map(ordem => this.loadCliente(ordem.id));
        
        // Quando todas as promessas forem resolvidas
        Promise.all(clientesPromises).then(() => {
          // Agora, todos os clientes foram carregados, e podemos proceder
          console.log('Clientes carregados com sucesso');
        }).catch(error => {
          console.error('Erro ao carregar os clientes:', error);
        });
      },
      (error) => {
        console.error('Erro ao carregar ordens de serviço', error);
      }
    );
  }

  openModal(status: string, clientName: string, totalValue: string, creationDate: string) {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });
    this.isModalOpen = true;

    document.getElementById('modal-overlay')?.classList.add('show');

    this.modalData = {
      status,
      clientName,
      totalValue,
      creationDate
    };
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
      (this.cliente[order.id] && this.cliente[order.id].toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }
  

  setRecords(records: number) {
    this.recordsToShow = records;
  }

  sortDirection: { [key: string]: 'asc' | 'desc' } = {};  // Para controlar a direção da ordenação
  sortColumn: string = '';  // Para armazenar a coluna que está sendo ordenada

  // Função para alternar a direção da ordenação e ordenar os dados
  sortTable(column: string) {
    // Alterna entre 'asc' e 'desc' para o estado da ordenação
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.sortColumn = column;
  
    // Função para acessar as propriedades aninhadas dinamicamente
    const getValue = (obj: any, path: string) => {
      if (path === 'cliente.nome') {
        return this.cliente[obj.id];  // Acesse o nome do cliente diretamente
      }
      
      // Acessa a propriedade de forma dinâmica (por exemplo, "order.statusOrdemServico.status")
      return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : null, obj);
    };
  
    this.orders = this.orders.sort((a, b) => {
      const aValue = getValue(a, column);
      const bValue = getValue(b, column);
  
      // Verifica se ambos os valores são numéricos
      const isNumeric = !isNaN(aValue) && !isNaN(bValue);
  
      if (aValue === null || bValue === null) {
        return 0; // Trata casos de valores nulos, não ordenando esses itens
      }
  
      // Caso os valores sejam numéricos, realiza a comparação numérica
      if (isNumeric) {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      // Caso contrário, compara como string
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }  

}
