import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessPaymentPage } from './success-payment.page';

describe('SuccessPaymentPage', () => {
  let component: SuccessPaymentPage;
  let fixture: ComponentFixture<SuccessPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
