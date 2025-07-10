import { Injectable } from '@angular/core';
import { OrdemServico } from '../../models/ordemServico.model';

@Injectable({
  providedIn: 'root'
})
export class ImpressaoService {

  private ordemServico : OrdemServico

  constructor() { }

  setOrdemServico(ordemServico : OrdemServico){
    this.ordemServico = ordemServico;
  }

  getOrdemServico() : OrdemServico {
    return this.ordemServico;
  }
}
