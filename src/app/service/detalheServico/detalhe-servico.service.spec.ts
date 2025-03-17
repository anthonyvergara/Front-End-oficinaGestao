import { TestBed } from '@angular/core/testing';

import { DetalheServicoService } from './detalhe-servico.service';

describe('DetalheServicoService', () => {
  let service: DetalheServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalheServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
