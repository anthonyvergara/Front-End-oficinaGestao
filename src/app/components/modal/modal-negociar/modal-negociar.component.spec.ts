import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNegociarComponent } from './modal-negociar.component';

describe('ModalNegociarComponent', () => {
  let component: ModalNegociarComponent;
  let fixture: ComponentFixture<ModalNegociarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNegociarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNegociarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
