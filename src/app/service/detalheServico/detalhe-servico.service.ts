import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalheServico } from '../../models/detalheServico.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalheServicoService {

  constructor(private http: HttpClient) { }

  private urlPutDetalheServico = `${environment.apiBaseUrl}${environment.urlPutDetalheServico}`

  putDetalheServico(idOrdemServico: number, detalhes: DetalheServico[]): Observable<DetalheServico[]> {
    const url = `${this.urlPutDetalheServico}${idOrdemServico}`; // URL com a variável `idOrdemServico`

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<DetalheServico[]>(url, detalhes, { headers });
  }
}
