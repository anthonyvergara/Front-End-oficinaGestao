import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagamento } from '../models/pagamento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrlPostPayOrdemServico = 'http://localhost:8080/oficina/pagamento/ordemServico/'

  constructor(private http: HttpClient) { }

  postPayOrdemServico(pagamento: Pagamento[], idOrdemServico: string): Observable<Pagamento[]> {
    return this.http.post<Pagamento[]>(`${this.apiUrlPostPayOrdemServico}${idOrdemServico}`,pagamento)
  }
}
