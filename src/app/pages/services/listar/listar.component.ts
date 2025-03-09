import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { OrdemServico } from 'src/app/service/models/ordemServico.model';
import { OrdemservicoService } from 'src/app/service/ordemServico/ordemservico.service';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { SharedService } from 'src/app/service/shared/shared.service';

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

  constructor(private clienteService: ClientesService, private ordemServico: OrdemservicoService, private sharedService: SharedService) { }

  modalData: any;
  isModalOpen = false;

  orders : OrdemServico[] = [];

  isItem1Open = true;
  isItem2Open = false;
  isItem3Open = false;
  isItem4Open = false;

  ngOnInit() {
    this.loadOrdemServico();
    this.sharedService.paymentCompleted$.subscribe(() => {
      this.loadOrdemServico();
    })
  }

  toggleCollapse(item: string) {
    // Fecha todos os itens
    this.isItem1Open = false;
    this.isItem2Open = false;
    this.isItem3Open = false;
    this.isItem4Open = false;
  
    // Abre o item desejado
    if (item === 'item1') {
      this.isItem1Open = true;
    } else if (item === 'item2') {
      this.isItem2Open = true;
    } else if (item === 'item3') {
      this.isItem3Open = true;
    } else if (item === 'item4') {
      this.isItem4Open = true;
    }
  
    // Atualiza a classe 'show' conforme o estado dos itens
    const element1 = document.querySelector('.custom-body.item1');
    element1.classList.toggle('show', this.isItem1Open);
  
    const element2 = document.querySelector('.custom-body.item2');
    element2.classList.toggle('show', this.isItem2Open);
  
    const element3 = document.querySelector('.custom-body.item3');
    element3.classList.toggle('show', this.isItem3Open);
  
    const element4 = document.querySelector('.custom-body.item4');
    element4.classList.toggle('show', this.isItem4Open);
  }

  

  loadOrdemServico(): void {
    this.ordemServico.getAllOrdemServico().subscribe(
      (ordemServico) => {
        console.log(ordemServico);
        this.orders = ordemServico;
    
        const clienteRequests = ordemServico.map(ordem => 
          this.clienteService.getClienteByIdOrdemServico(ordem.id.toString())
        );
      },
      (error) => {
        console.error('Erro ao carregar ordens de serviço', error);
      }
    );
  }

  openModal(id: number, status: string, valorTotal: number, nome: string) {
    //console.log('Modal aberto com:', { status, clientName, totalValue, creationDate });
    this.isModalOpen = true;

    document.getElementById('modal-overlay')?.classList.add('show');

    const ordemEncontrada = this.orders.find(ordem => ordem.id == id);

    let valorEntrada = 0; // Inicializa com null ou qualquer valor padrão
    if (ordemEncontrada) {
      if(ordemEncontrada.pagamento != null){
        ordemEncontrada.pagamento.forEach(pagamento => {
          valorEntrada += pagamento.valorPago;
        })
      }
    }
    console.log("valorEntrada: ", valorEntrada); // Exibe o valor encontrado

    this.modalData = {
      id,
      nome,
      status,
      valorTotal,
      valorEntrada
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

  recordsToShow = 10;  // Número de registros a serem exibidos
  searchQuery = '';   // Para buscar pelo nome do cliente

  currentPage = 1;  // Página atual
  itemsPerPage = 5; // Número de itens por página (no seu caso, 1 cliente por página)

  get filteredOrders() {
    return this.orders.filter(order =>
      (order.cliente.nome.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }
  

  setRecords(records: number) {
    this.recordsToShow = records;
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
        return obj.cliente?.nome;  // Acesse o nome do cliente diretamente
      }

      if (path === 'status') {
        return obj.statusOrdemServico?.tipoStatus;  // Acesse o nome do cliente diretamente
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
