import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUpLoadComponent } from './file-up-load.component';

describe('FileUpLoadComponent', () => {
  let component: FileUpLoadComponent;
  let fixture: ComponentFixture<FileUpLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUpLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUpLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
