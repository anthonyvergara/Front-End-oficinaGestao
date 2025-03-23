import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagamento } from '../models/pagamento.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrlPostPayOrdemServico = `${environment.apiBaseUrl}${environment.apiUrlPostPayOrdemServico}`

  constructor(private http: HttpClient) { }

  postPayOrdemServico(pagamento: Pagamento[], idOrdemServico: string): Observable<Pagamento[]> {
    return this.http.post<Pagamento[]>(`${this.apiUrlPostPayOrdemServico}${idOrdemServico}`,pagamento)
  }
}
