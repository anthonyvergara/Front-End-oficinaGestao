export interface StatusOrdemServico{
    id: number;
    tipoStatus: string;
    ultimoPagamento: string;
    proximoVencimento: string;
    saldoDevedor: number;
    valorProximaParcela: number;
}