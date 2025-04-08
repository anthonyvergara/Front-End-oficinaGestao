export const environment = {
  production: true,

  apiBaseUrl: 'https://apiofc.datasweb.com', 

  //STATUS ORDEM SERVICO
  urlGetStatusOrdemServicoById: "/status/",

  // PAGAMENTO
  apiUrlPostPayOrdemServico: '/pagamento/ordemServico/',

  // DETALHE SERVICO
  urlPutDetalheServico: '/detalheServico/',

  // CLIENTES
  apiUrlListClient : '/cliente',
  apiUrlSaveClient : '/cliente/2',
  apiUrlGetClienteByIdOrdemServico : "/cliente/ordemServico/",
  apiUrlFindByNameContains : "/cliente/",

  // ORDEM DE SERVIÇO
  apiGetOrdemServicoByIdCliente: '/ordemServico/cliente/',
  apiUrlGetAllOrdemServico: "/ordemServico/oficina/2",
  apiUrlGetOrdemServicoById: "/ordemServico/",
  apiUrlCriarOrdemServico: '/ordemServico/cliente',

  // PARCELAMENTO
  urlPutParcelamento: '/parcelamento/ordemServico'
};
