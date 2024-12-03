import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarClienteComponent } from './criar-ordem.component';

describe('CriarClienteComponent', () => {
  let component: CriarClienteComponent;
  let fixture: ComponentFixture<CriarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriarClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
