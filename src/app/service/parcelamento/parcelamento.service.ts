import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelamentoService {

  private urlPutParcelamento = (ordemServicoId: number, numParcelas: number) => 
    `${environment.apiBaseUrl}${environment.urlPutParcelamento}/${ordemServicoId}/parcela/${numParcelas}`;

  constructor(private http: HttpClient) { }

  putParcelamento(idOrdemServico : number, numParcelas: number) : Observable<any>{
    const url = this.urlPutParcelamento(idOrdemServico, numParcelas);
    return this.http.put(url,{});
  }
}
