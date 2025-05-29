import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportlessPage } from './reportless.page';

describe('ReportlessPage', () => {
  let component: ReportlessPage;
  let fixture: ComponentFixture<ReportlessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportlessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
