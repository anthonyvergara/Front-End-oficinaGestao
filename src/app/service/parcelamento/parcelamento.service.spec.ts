import { TestBed } from '@angular/core/testing';

import { ParcelamentoService } from './parcelamento.service';

describe('ParcelamentoService', () => {
  let service: ParcelamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
