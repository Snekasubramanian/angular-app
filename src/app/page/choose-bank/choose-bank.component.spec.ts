import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseBankComponent } from './choose-bank.component';

describe('ChooseBankComponent', () => {
  let component: ChooseBankComponent;
  let fixture: ComponentFixture<ChooseBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseBankComponent]
    });
    fixture = TestBed.createComponent(ChooseBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
