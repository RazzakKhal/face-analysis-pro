import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakepicturePage } from './takepicture.page';

describe('TakepicturePage', () => {
  let component: TakepicturePage;
  let fixture: ComponentFixture<TakepicturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TakepicturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
