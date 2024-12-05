import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';  // Importando a interface Cliente

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrlListClient = 'http://localhost:8080/oficina/cliente';  // URL da sua API
  private apiUrlSaveClient = 'http://localhost:8080/oficina/cliente/52' // 2 representa o id da oficina
  private apiUrlGetClienteByIdOrdemServico = "http://localhost:8080/oficina/cliente/ordemServico/";


  constructor(private http: HttpClient) { }

  // Método para obter a lista de clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrlListClient);
  }

  getClienteByIdOrdemServico(idOrdemServico: number){
    const url = `${this.apiUrlGetClienteByIdOrdemServico}${idOrdemServico}`;
    return this.http.get<Cliente>(url);
  }

  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrlSaveClient, cliente);
  }

}
