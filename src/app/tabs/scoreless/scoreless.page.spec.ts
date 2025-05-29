import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScorelessPage } from './scoreless.page';

describe('ScorelessPage', () => {
  let component: ScorelessPage;
  let fixture: ComponentFixture<ScorelessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorelessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
