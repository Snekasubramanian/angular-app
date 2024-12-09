import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixdrawerComponent } from './fixdrawer.component';

describe('FixdrawerComponent', () => {
  let component: FixdrawerComponent;
  let fixture: ComponentFixture<FixdrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixdrawerComponent]
    });
    fixture = TestBed.createComponent(FixdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
