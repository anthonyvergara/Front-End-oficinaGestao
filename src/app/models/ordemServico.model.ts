import { DetalheServico } from "./detalheServico.model";
import { Pagamento } from "./pagamento.model";
import { StatusOrdemServico } from "./statusOrdemServico.model";
import { Parcela } from "./parcela.model";
import { Cliente } from "./cliente.model";

export interface OrdemServico{
    id: number;
    invoiceNumber: number;
    vat: number;
    dataInicio: string;
    valorTotal: number;
    tipoPagamento: string;
    observacao: string;
    quantidadeParcelas : number;
    detalheServico : DetalheServico[];
    pagamento : Pagamento[];
    statusOrdemServico : StatusOrdemServico;
    parcela : Parcela[];
    cliente : Cliente;
}