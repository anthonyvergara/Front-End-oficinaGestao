import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdemServico } from '../models/ordemServico.model';
@Injectable({
  providedIn: 'root'
})
export class OrdemservicoService {

  private apiUrl = 'http://localhost:8080/oficina/ordemServico/cliente/';// 2 representa o id da oficina
  private apiUrlPostOrdemServico = 'http://localhost:8080/oficina/ordemServico/cliente/1552/oficina/52';

  constructor(private http: HttpClient) { }

  // Método para obter a lista de clientes
  getOrdemServicoByIdCliente(clienteId : string): Observable<OrdemServico[]> {
    const url = `${this.apiUrl}${clienteId}`;
    return this.http.get<OrdemServico[]>(url);
  }

  postOrdemServico(ordemServico: OrdemServico): Observable<any>{
    return this.http.post(this.apiUrlPostOrdemServico,ordemServico);
  }
}
