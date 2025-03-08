import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParcelamentoService {

  private urlPutParcelamento = (ordemServicoId: number, numParcelas: number) => 
    `http://localhost:8080/oficina/parcelamento/ordemServico/${ordemServicoId}/parcela/${numParcelas}`;

  constructor(private http: HttpClient) { }

  putParcelamento(idOrdemServico : number, numParcelas: number) : Observable<any>{
    const url = this.urlPutParcelamento(idOrdemServico, numParcelas);
    return this.http.put(url,{});
  }
}
