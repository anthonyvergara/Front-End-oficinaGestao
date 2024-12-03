import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewClienteComponent } from './modal-view-cliente.component';

describe('ModalViewClienteComponent', () => {
  let component: ModalViewClienteComponent;
  let fixture: ComponentFixture<ModalViewClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalViewClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
