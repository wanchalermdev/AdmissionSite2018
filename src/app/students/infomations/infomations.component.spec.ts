import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfomationsComponent } from './infomations.component';

describe('InfomationsComponent', () => {
  let component: InfomationsComponent;
  let fixture: ComponentFixture<InfomationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfomationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfomationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
