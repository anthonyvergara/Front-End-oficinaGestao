import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClienteProfileComponent } from './modal-cliente-profile.component';

describe('ModalClienteProfileComponent', () => {
  let component: ModalClienteProfileComponent;
  let fixture: ComponentFixture<ModalClienteProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalClienteProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalClienteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
