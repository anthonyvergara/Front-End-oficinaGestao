import { Component, Input, OnInit } from '@angular/core';
import { ImpressaoService } from 'src/app/service/impressao/impressao.service';
import { OrdemServico } from 'src/app/models/ordemServico.model';

@Component({
  selector: 'app-impressao',
  templateUrl: './impressao.component.html',
  styleUrls: ['./impressao.component.scss']
})
export class ImpressaoComponent implements OnInit {
  @Input() dados: any;

  ordemServico : OrdemServico

  constructor(private impressaoService : ImpressaoService) { }

  ngOnInit(): void {
    this.ordemServico = this.impressaoService.getOrdemServico();
    this.imprimir();
  }

  imprimir() {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      // Você pode renderizar um template HTML com as informações
      printWindow.document.write(`
        <html>
          <head>
            <title>Impressão Ordem de Serviço</title>
            <style>
              /* Adicione estilos específicos para a impressão aqui */
              body { font-family: Arial, sans-serif; }
              .titulo { font-size: 20px; font-weight: bold; }
              .detalhes { margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1 class="titulo">Ordem de Serviço #${this.ordemServico.invoiceNumber}</h1>
            <p><strong>Cliente:</strong> ${this.ordemServico.cliente.nome}</p>
            <div class="detalhes">
              <p><strong>Detalhes do Serviço:</strong> ${this.ordemServico.id}</p>
              <p><strong>Data:</strong> ${this.ordemServico.tipoPagamento}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close(); // Necessário para carregar o conteúdo
      printWindow.print(); // Inicia o comando de impressão
    }
  }

}
