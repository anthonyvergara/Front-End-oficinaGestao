// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  apiBaseUrl: 'http://localhost:8080/oficina',

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
  apiUrlUpdateClient : '/cliente/2',

  // ORDEM DE SERVIÇO
  apiGetOrdemServicoByIdCliente: '/ordemServico/cliente/',
  apiUrlGetAllOrdemServico: "/ordemServico/oficina/2",
  apiUrlGetOrdemServicoById: "/ordemServico/",
  apiUrlCriarOrdemServico: '/ordemServico/cliente',

  // PARCELAMENTO
  urlPutParcelamento: '/parcelamento/ordemServico'
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
