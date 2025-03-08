import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusOrdemServico } from '../models/statusOrdemServico.model';

@Injectable({
  providedIn: 'root'
})
export class StatusOrdemServicoService {

  private urlGetStatusOrdemServicoById = "http://localhost:8080/oficina/status/"

  constructor(private http: HttpClient) { }

  getStatusOrdemServico(idOrdemServico: number){
    const url = `${this.urlGetStatusOrdemServicoById}${idOrdemServico}`;
    return this.http.get<StatusOrdemServico>(url)
  }
}
