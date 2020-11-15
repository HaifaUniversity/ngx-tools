import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxToolsComponent } from './ngx-tools.component';

describe('NgxToolsComponent', () => {
  let component: NgxToolsComponent;
  let fixture: ComponentFixture<NgxToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
