import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHistoryPaymentComponent } from './modal-history-payment.component';

describe('ModalHistoryPaymentComponent', () => {
  let component: ModalHistoryPaymentComponent;
  let fixture: ComponentFixture<ModalHistoryPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalHistoryPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalHistoryPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
