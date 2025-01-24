import { TestBed } from '@angular/core/testing';

import { ImpressaoService } from './impressao.service';

describe('ImpressaoService', () => {
  let service: ImpressaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpressaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
