import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterM1DialogComponent } from './register-m1-dialog.component';

describe('RegisterM1DialogComponent', () => {
  let component: RegisterM1DialogComponent;
  let fixture: ComponentFixture<RegisterM1DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterM1DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterM1DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
