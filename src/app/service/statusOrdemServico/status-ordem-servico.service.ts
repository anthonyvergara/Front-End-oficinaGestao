import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusOrdemServico } from '../models/statusOrdemServico.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusOrdemServicoService {

  private urlGetStatusOrdemServicoById = `${environment.apiBaseUrl}${environment.urlGetStatusOrdemServicoById}`

  constructor(private http: HttpClient) { }

  getStatusOrdemServico(idOrdemServico: number){
    const url = `${this.urlGetStatusOrdemServicoById}${idOrdemServico}`;
    return this.http.get<StatusOrdemServico>(url)
  }
}
