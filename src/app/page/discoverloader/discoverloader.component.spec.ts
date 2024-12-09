import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverloaderComponent } from './discoverloader.component';

describe('DiscoverloaderComponent', () => {
  let component: DiscoverloaderComponent;
  let fixture: ComponentFixture<DiscoverloaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverloaderComponent]
    });
    fixture = TestBed.createComponent(DiscoverloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
