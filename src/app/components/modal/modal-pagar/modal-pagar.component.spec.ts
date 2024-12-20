import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagarComponent } from './modal-pagar.component';

describe('ModalPagarComponent', () => {
  let component: ModalPagarComponent;
  let fixture: ComponentFixture<ModalPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
