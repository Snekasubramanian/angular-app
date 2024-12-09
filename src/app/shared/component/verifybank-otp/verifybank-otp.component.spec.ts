import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifybankOtpComponent } from './verifybank-otp.component';

describe('VerifybankOtpComponent', () => {
  let component: VerifybankOtpComponent;
  let fixture: ComponentFixture<VerifybankOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifybankOtpComponent]
    });
    fixture = TestBed.createComponent(VerifybankOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
