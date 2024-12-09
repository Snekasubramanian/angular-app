import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMobileNumberComponent } from './modify-mobile-number.component';

describe('ModifyMobileNumberComponent', () => {
  let component: ModifyMobileNumberComponent;
  let fixture: ComponentFixture<ModifyMobileNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMobileNumberComponent]
    });
    fixture = TestBed.createComponent(ModifyMobileNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
