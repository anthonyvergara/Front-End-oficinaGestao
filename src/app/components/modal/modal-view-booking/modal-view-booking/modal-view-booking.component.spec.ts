import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewBookingComponent } from './modal-view-booking.component';

describe('ModalViewBookingComponent', () => {
  let component: ModalViewBookingComponent;
  let fixture: ComponentFixture<ModalViewBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalViewBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
