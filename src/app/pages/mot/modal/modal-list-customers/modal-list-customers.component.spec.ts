import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListCustomersComponent } from './modal-list-customers.component';

describe('ModalListCustomersComponent', () => {
  let component: ModalListCustomersComponent;
  let fixture: ComponentFixture<ModalListCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListCustomersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
