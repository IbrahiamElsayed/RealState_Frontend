import { TestBed } from '@angular/core/testing';

import { BrowsePropertyService } from './browse-property-service';

describe('BrowsePropertyService', () => {
  let service: BrowsePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowsePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
