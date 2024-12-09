import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentDrawerComponent } from './consent-drawer.component';

describe('ConsentDrawerComponent', () => {
  let component: ConsentDrawerComponent;
  let fixture: ComponentFixture<ConsentDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentDrawerComponent]
    });
    fixture = TestBed.createComponent(ConsentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
