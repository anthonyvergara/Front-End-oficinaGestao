import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdemServico } from '../models/ordemServico.model';
@Injectable({
  providedIn: 'root'
})
export class OrdemservicoService {

  private apiGetOrdemServicoByIdCliente = 'http://localhost:8080/oficina/ordemServico/cliente/';// 2 representa o id da oficina
  private apiUrlPostOrdemServico = 'http://localhost:8080/oficina/ordemServico/cliente/457/oficina/2';
  private apiUrlGetAllOrdemServico = "http://localhost:8080/oficina/ordemServico/oficina/2";
  private apiUrlGetOrdemServicoById = "http://localhost:8080/oficina/ordemServico/";

  private apiUrlCriarOrdemServico = (idCLiente : string) => 
    `http://localhost:8080/oficina/ordemServico/cliente/${idCLiente}/oficina/2`

  constructor(private http: HttpClient) { }

  // Método para obter a lista de clientes
  getOrdemServicoByIdCliente(clienteId : string): Observable<OrdemServico[]> {
    const url = `${this.apiGetOrdemServicoByIdCliente}${clienteId}`;
    return this.http.get<OrdemServico[]>(url);
  }

  getOrdemServicoById(id: number){
    const url = `${this.apiUrlGetOrdemServicoById}${id}`;
    return this.http.get<OrdemServico>(url);
  }

  getAllOrdemServico(){
    return this.http.get<OrdemServico[]>(this.apiUrlGetAllOrdemServico)
  }

  postOrdemServico(ordemServico: OrdemServico, idCliente : string): Observable<any>{
    const url = this.apiUrlCriarOrdemServico(idCliente)
    return this.http.post(url,ordemServico);
  }
}
