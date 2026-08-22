import { TestBed } from '@angular/core/testing';

import { PropertyHome } from './property-home';

describe('PropertyHome', () => {
  let service: PropertyHome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyHome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
