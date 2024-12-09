import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingpageComponent } from './loadingpage.component';

describe('LoadingpageComponent', () => {
  let component: LoadingpageComponent;
  let fixture: ComponentFixture<LoadingpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingpageComponent]
    });
    fixture = TestBed.createComponent(LoadingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
