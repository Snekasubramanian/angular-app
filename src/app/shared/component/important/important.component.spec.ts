import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantComponent } from './important.component';

describe('ImportantComponent', () => {
  let component: ImportantComponent;
  let fixture: ComponentFixture<ImportantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportantComponent]
    });
    fixture = TestBed.createComponent(ImportantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
