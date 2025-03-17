import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalheServico } from '../models/detalheServico.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalheServicoService {

  constructor(private http: HttpClient) { }

  private urlPutDetalheServico = 'http://localhost:8080/oficina/detalheServico/';

  putDetalheServico(idOrdemServico: number, detalhes: DetalheServico[]): Observable<DetalheServico[]> {
    const url = `${this.urlPutDetalheServico}${idOrdemServico}`; // URL com a variável `idOrdemServico`
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<DetalheServico[]>(url, detalhes, { headers });
  }
}
