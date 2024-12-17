import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ClientesService } from '../../service/clientes/clientes.service';
import { Cliente } from '../../service/models/cliente.model';  // Importando a interface Cliente
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';

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
  isModalViewClienteOpen = false;
  ordemServicos: OrdemServico[] = [];
  clientes: Cliente[] = [];  // Usando a interface Cliente
  searchQuery = '';   // Para buscar pelo nome do cliente
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};  // Para controlar a direção da ordenação
  sortColumn: string = '';  // Para armazenar a coluna que está sendo ordenada
  saldosDevedores: { [key: string]: number } = {};

  modalData: any;

  constructor(private clientesService: ClientesService, private ordemServicoService : OrdemservicoService) { }

  currentPage = 1;  // Página atual
  itemsPerPage = 5; // Número de itens por página (no seu caso, 1 cliente por página)


  ngOnInit() {
    this.loadClientes();  // Carregar os dados da API
  }

  openModalViewCliente(id: number, nome: string, email: string, telefone: number){
    this.isModalViewClienteOpen = true;

    this.clientes.forEach(clientes => {
      if(email.toUpperCase() == clientes.email.toUpperCase()){
        const telefone = clientes.telefone.length > 0 ? clientes.telefone[0].numero : null;
        const ddd = clientes.telefone.length > 0 ? clientes.telefone[0].ddd : null;
        const rua = clientes.endereco.length > 0 ? clientes.endereco[0].rua : null;
        const numero = clientes.endereco.length > 0 ? clientes.endereco[0].numero : null;
        const cidade = clientes.endereco.length > 0 ? clientes.endereco[0].cidade : null;
        const postcode = clientes.endereco.length > 0 ? clientes.endereco[0].postcode : null;
        var saldoDevedor: number = null;
        Object.keys(this.saldosDevedores).forEach(clienteId => {
          if(clienteId = clientes.id.toString()){
            saldoDevedor = this.saldosDevedores[clienteId];
          }
        })

        this.modalData = {
          id,
          nome,
          dataNascimento: clientes.dataNascimento,
          email,
          telefone,
          ddd,
          rua,
          numero,
          cidade,
          postcode,
          saldoDevedor,

        }
      }
    })
    
    document.getElementById('modal-overlay')?.classList.add('show');
  }

  openModal() {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });
    this.isModalOpen = true;

    document.getElementById('modal-overlay')?.classList.add('show');
  }

  closeModal() {
    this.isModalOpen = false;
    this.isModalViewClienteOpen = false;
    document.getElementById('modal-overlay')?.classList.remove('show');
  }

  loadOrdemServico(clienteId: string): void {
    if (clienteId) {
      this.ordemServicoService.getOrdemServicoByIdCliente(clienteId).subscribe(
        (ordens) => {
          this.calculateSaldoDevedorPorCliente(clienteId, ordens);
        },
        (error) => {
          console.error('Erro ao carregar ordens de serviço:', error);
        }
      );
    }
  }

  getPagedClients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }


  getPaginationPages(): number[] {
    const totalPages = this.totalPages();
    const pages = [];
  
    if (totalPages <= 4) {
      // Se houver 4 ou menos páginas, exibe todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se houver mais de 4 páginas, exibe 1, 2, 3, ..., e a última
      pages.push(1, 2, 3); // sempre mostra 1, 2, 3
      pages.push(-1); // Indica os "..."
      pages.push(totalPages); // sempre mostra a última página
    }
  
    return pages;
  }
    
  
  
  // Método para calcular o saldo devedor de um cliente específico
  calculateSaldoDevedorPorCliente(clienteId: string, ordens: OrdemServico[]): void {
    let totalSaldoDevedor = 0;
    ordens.forEach(ordem => {
      if (ordem.statusOrdemServico && ordem.statusOrdemServico.saldoDevedor) {
        totalSaldoDevedor += ordem.statusOrdemServico.saldoDevedor;
      }
    });

    this.saldosDevedores[clienteId] = totalSaldoDevedor;
  }
  

  loadClientes(): void {
    this.clientesService.getClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;
        // Para cada cliente, carrega as ordens de serviço e calcula o saldo devedor
        this.clientes.forEach(cliente => {
          this.loadOrdemServico(cliente.id.toString()); // Passa o clienteId como string
        });
      },
      (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    );
  }

  // Função para exibir o saldo devedor de cada cliente
  getSaldoDevedor(clienteId: string): number {
    return this.saldosDevedores[clienteId] || 0;
  }

  handleButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Impede a propagação do evento de clique
    // Adicione a lógica que você deseja executar ao clicar no botão
  }

  get filteredOrders() {
    return this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Função para alternar a direção da ordenação e ordenar os dados
  sortTable(column: string) {
    // Alterna a direção da ordenação (asc/desc)
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.sortColumn = column;
  
    // Ordenação personalizada
    this.clientes = this.clientes.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
  
      // Se a propriedade for 'saldoDevedor', usamos o valor da propriedade em 'saldosDevedores'
      if (column === 'valorTotal') {
        aValue = this.saldosDevedores[a.id.toString()] || 0;  // Acessa o saldo devedor do cliente
        bValue = this.saldosDevedores[b.id.toString()] || 0;  // Acessa o saldo devedor do cliente
      }
      // Se a propriedade for 'telefone', pegamos o primeiro número do array
      if (column === 'telefone' && aValue && bValue) {
        aValue = aValue[0].numero;  // Acessa o primeiro telefone
        bValue = bValue[0].numero;
      }
  
      // Comparação de strings e números
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Se for string, compara lexicograficamente
        return direction === 'asc' 
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase()) 
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Se for número, compara numericamente
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      // Caso o valor seja de outro tipo ou a comparação não tenha sido feita, mantemos 0 (sem mudança de posição)
      return 0;
    });
  }
}
