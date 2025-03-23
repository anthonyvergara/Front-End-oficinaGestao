import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdemServico } from '../models/ordemServico.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrdemservicoService {

  private apiGetOrdemServicoByIdCliente = `${environment.apiBaseUrl}${environment.apiGetOrdemServicoByIdCliente}` // 2 representa o id da oficina
  private apiUrlGetAllOrdemServico = `${environment.apiBaseUrl}${environment.apiUrlGetAllOrdemServico}`
  private apiUrlGetOrdemServicoById = `${environment.apiBaseUrl}${environment.apiUrlGetOrdemServicoById}`

  private apiUrlCriarOrdemServico = (idCLiente : string) => 
    `${environment.apiBaseUrl}${environment.apiUrlCriarOrdemServico}/${idCLiente}/oficina/2`

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
