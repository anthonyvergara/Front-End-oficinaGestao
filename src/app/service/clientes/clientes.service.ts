import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';  // Importando a interface Cliente
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrlListClient = `${environment.apiBaseUrl}${environment.apiUrlListClient}`  // URL da sua API
  private apiUrlSaveClient = `${environment.apiBaseUrl}${environment.apiUrlSaveClient}`// 2 representa o id da oficina
  private apiUrlGetClienteByIdOrdemServico = `${environment.apiBaseUrl}${environment.apiUrlGetClienteByIdOrdemServico}`
  private apiUrlFindByNameContains = `${environment.apiBaseUrl}${environment.apiUrlFindByNameContains}`
  private apiUrlUpdateClient = `${environment.apiBaseUrl}${environment.apiUrlUpdateClient}`

  constructor(private http: HttpClient) { }

  // Método para obter a lista de clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrlListClient);
  }

  getClienteByNameContains(nome : string) : Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrlFindByNameContains}?name=${nome}`);
  }

  getClienteByIdOrdemServico(idOrdemServico: string){
    const url = `${this.apiUrlGetClienteByIdOrdemServico}${idOrdemServico}`;
    return this.http.get<Cliente>(url);
  }

  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrlSaveClient, cliente);
  }

  atualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.apiUrlUpdateClient, cliente);
  }

}
