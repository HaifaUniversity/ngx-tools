import { TestBed } from '@angular/core/testing';

import { NgxToolsService } from './ngx-tools.service';

describe('NgxToolsService', () => {
  let service: NgxToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
