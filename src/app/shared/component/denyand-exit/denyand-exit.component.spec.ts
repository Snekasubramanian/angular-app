import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenyandExitComponent } from './denyand-exit.component';

describe('DenyandExitComponent', () => {
  let component: DenyandExitComponent;
  let fixture: ComponentFixture<DenyandExitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DenyandExitComponent]
    });
    fixture = TestBed.createComponent(DenyandExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
