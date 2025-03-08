import { TestBed } from '@angular/core/testing';

import { StatusOrdemServicoService } from './status-ordem-servico.service';

describe('StatusOrdemServicoService', () => {
  let service: StatusOrdemServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusOrdemServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
