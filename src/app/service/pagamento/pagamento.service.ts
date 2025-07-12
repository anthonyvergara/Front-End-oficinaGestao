import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagamento } from '../../models/pagamento.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Cliente} from '../../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrlPostPayOrdemServico = `${environment.apiBaseUrl}${environment.apiUrlPostPayOrdemServico}`
  private apiUrlGetPaymentByIdOrdem = `${environment.apiBaseUrl}${environment.apiUrlGetPaymentByIdOrdem}`

  constructor(private http: HttpClient) { }

  postPayOrdemServico(pagamento: Pagamento[], idOrdemServico: string): Observable<Pagamento[]> {
    return this.http.post<Pagamento[]>(`${this.apiUrlPostPayOrdemServico}${idOrdemServico}`,pagamento)
  }
  getPaymentsByIdOrdem(idOrdemServico: string): Observable<Pagamento[]> {
    const url = `${this.apiUrlGetPaymentByIdOrdem}${idOrdemServico}`;
    return this.http.get<Pagamento[]>(url);
  }
}
