import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdemServico } from '../models/ordemServico.model';
@Injectable({
  providedIn: 'root'
})
export class OrdemservicoService {

  private apiUrl = 'http://localhost:8080/oficina/ordemServico/cliente/';// 2 representa o id da oficina


  constructor(private http: HttpClient) { }

  // Método para obter a lista de clientes
  getOrdemServicoByIdCliente(clienteId : string): Observable<OrdemServico[]> {
    clienteId = "1502";
    const url = `${this.apiUrl}${clienteId}`;
    console.log(url);
    return this.http.get<OrdemServico[]>(url);
  }
}
